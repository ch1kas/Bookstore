import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BooksService } from './books.service';
import { BookEntity } from './models/books.entity';
import { BadRequestException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

describe('BooksService', () => {
  let service: BooksService;
  let repository: Repository<BookEntity>;

  const mockBook: BookEntity = {
    id: 1,
    title: 'Mock Book Title',
    author: 'Mock Author',
    publicationDate: new Date('2022-01-01'),
    created_at: new Date(),
    updated_at: new Date()
  };

  const mockBooksRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(BookEntity),
          useValue: mockBooksRepository,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    repository = module.get<Repository<BookEntity>>(getRepositoryToken(BookEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new book', async () => {
      const createBookDto: CreateBookDto = {
        title: 'New Book',
        author: 'New Author',
        publicationDate: new Date('2023-01-01'),
      };

      mockBooksRepository.save.mockResolvedValue(createBookDto);

      const result = await service.create(createBookDto);
      expect(result).toEqual(createBookDto);
      expect(mockBooksRepository.save).toHaveBeenCalledWith(createBookDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      mockBooksRepository.find.mockResolvedValue([mockBook]);

      const result = await service.findAll();
      expect(result).toEqual([mockBook]);
      expect(mockBooksRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single book by id', async () => {
      mockBooksRepository.findOneBy.mockResolvedValue(mockBook);
      const result = await service.findOne(1);
      expect(result).toEqual(mockBook);
      expect(mockBooksRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw an error if the book does not exist', async () => {
      mockBooksRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(BadRequestException);
      expect(mockBooksRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('update', () => {
    it('should update a book and return the updated book details', async () => {
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Title',
        author: 'Updated Author',
        publicationDate: new Date('2024-01-01'),
      };

      mockBooksRepository.findOneBy.mockResolvedValue(mockBook); // Book exists
      mockBooksRepository.update.mockResolvedValue(updateBookDto);

      const result = await service.update(1, updateBookDto);
      expect(result).toEqual(updateBookDto);
      expect(mockBooksRepository.update).toHaveBeenCalledWith(1, updateBookDto);
    });

    it('should throw an error if the book does not exist', async () => {
      mockBooksRepository.findOneBy.mockResolvedValue(null);

      const updateBookDto: UpdateBookDto = {
        title: 'Updated Title',
        author: 'Updated Author',
        publicationDate: new Date('2024-01-01'),
      };

      await expect(service.update(1, updateBookDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should delete a book by id and return a success message', async () => {
      mockBooksRepository.findOneBy.mockResolvedValue(mockBook); // Book exists
      mockBooksRepository.delete.mockResolvedValue({});

      const result = await service.remove(1);
      expect(result).toEqual({ message: 'Book deleted successfully!' });
      expect(mockBooksRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw an error if the book does not exist', async () => {
      mockBooksRepository.findOneBy.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('doesBookExist', () => {
    it('should return true if the book exists', async () => {
      mockBooksRepository.findOneBy.mockResolvedValue(mockBook);

      const result = await service.doesBookExist(1);
      expect(result).toBe(true);
      expect(mockBooksRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw an error if the book does not exist', async () => {
      mockBooksRepository.findOneBy.mockResolvedValue(null);

      await expect(service.doesBookExist(1)).rejects.toThrow(BadRequestException);
    });
  });
});
