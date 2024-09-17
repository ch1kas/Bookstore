import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookEntity } from './models/books.entity';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @ApiOperation({ summary: 'Create a book' })
  @ApiResponse({ status: 201 })
  @Post()
  create(@Body() createBookDto: CreateBookDto): Promise<BookEntity> {
    return this.booksService.create(createBookDto);
  }

  @ApiOperation({ summary: 'Get all books' })
  @ApiResponse({ status: 200 })
  @Get()
  findAll(): Promise<BookEntity[]> {
    return this.booksService.findAll();
  }

  @ApiOperation({ summary: 'Get book by id' })
  @ApiResponse({ status: 200 })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<BookEntity> {
    return this.booksService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a book by id' })
  @ApiResponse({ status: 200 })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateBookDto: UpdateBookDto
  ): Promise<UpdateBookDto> {
    return this.booksService.update(id, updateBookDto);
  }

  @ApiOperation({ summary: 'Delete a book by id' })
  @ApiResponse({ status: 200, description: 'Returns success message' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.booksService.remove(id);
  }
}
