import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { BookEntity } from './models/books.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  const mockBook: BookEntity = {
    id: 1,
    title: 'Mock Book Title',
    author: 'Mock Author',
    publicationDate: new Date('2022-01-01'),
    created_at: new Date(),
    updated_at: new Date()
  };

  const mockBooksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new book', async () => {
      const createBookDto: CreateBookDto = {
        title: 'New Book',
        author: 'New Author',
        publicationDate: new Date('2023-01-01'),
      };

      mockBooksService.create.mockResolvedValue(mockBook);

      const result = await controller.create(createBookDto);
      expect(result).toEqual(mockBook);
      expect(mockBooksService.create).toHaveBeenCalledWith(createBookDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      mockBooksService.findAll.mockResolvedValue([mockBook]);

      const result = await controller.findAll();
      expect(result).toEqual([mockBook]);
      expect(mockBooksService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single book by id', async () => {
      mockBooksService.findOne.mockResolvedValue(mockBook);

      const result = await controller.findOne(1);
      expect(result).toEqual(mockBook);
      expect(mockBooksService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a book and return the updated book details', async () => {
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Title',
        author: 'Updated Author',
        publicationDate: new Date('2024-01-01'),
      };

      mockBooksService.update.mockResolvedValue(updateBookDto);

      const result = await controller.update(1, updateBookDto);
      expect(result).toEqual(updateBookDto);
      expect(mockBooksService.update).toHaveBeenCalledWith(1, updateBookDto);
    });
  });

  describe('remove', () => {
    it('should delete a book by id and return a success message', async () => {
      mockBooksService.remove.mockResolvedValue({ message: 'Book deleted successfully!' });

      const result = await controller.remove(1);
      expect(result).toEqual({ message: 'Book deleted successfully!' });
      expect(mockBooksService.remove).toHaveBeenCalledWith(1);
    });
  });
});