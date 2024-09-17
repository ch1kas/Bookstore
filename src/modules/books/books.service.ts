import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookEntity } from './models/books.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';


@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly booksRepository: Repository<BookEntity>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<BookEntity> {
    return await this.booksRepository.save(createBookDto);
  }

  async findAll(): Promise<BookEntity[]> {
    return await this.booksRepository.find();
  }

  async findOne(id: number): Promise<BookEntity> {
    await this.doesBookExist(id);
    return await this.booksRepository.findOneBy({ id });
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<UpdateBookDto> {
    await this.doesBookExist(id);
    await this.booksRepository.update(id, updateBookDto);
    return updateBookDto;
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.doesBookExist(id);
    await this.booksRepository.delete(id);
    return {
      message: 'Book deleted successfully!',
    };
  }

  async doesBookExist(id: number): Promise<boolean> {
    const book = await this.booksRepository.findOneBy({ id });
    if (!book) {
      throw new BadRequestException({
        message: 'Book with provided id does not exist!',
      });
    }
    return true;
  }
}