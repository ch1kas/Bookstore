import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../users/models/users.entity';
import { Repository } from 'typeorm';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<UserEntity>;
  let jwtService: JwtService;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const createUserDto: CreateUserDto = { email: 'test@example.com', password: 'password' };
      
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue({ email: createUserDto.email });
      mockUserRepository.save.mockResolvedValue({ email: createUserDto.email, id: 1 });

      const result = await authService.register(createUserDto);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email: createUserDto.email,
        password: expect.any(String),
      });
      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(result).toEqual({ email: createUserDto.email, id: 1 });
    });

    it('should throw an error if email is already in use', async () => {
      const createUserDto: CreateUserDto = { email: 'test@example.com', password: 'password' };
      
      mockUserRepository.findOne.mockResolvedValue({ id: 1, email: createUserDto.email });

      await expect(authService.register(createUserDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('should login a valid user and return a JWT token', async () => {
      const loginUserDto: LoginUserDto = { email: 'test@example.com', password: 'password' };
      const user = { id: 1, email: loginUserDto.email, password: 'hashedPassword' };

      jest.spyOn(authService, 'validateUser').mockResolvedValue(user);
      mockJwtService.sign.mockReturnValue('signed-jwt-token');

      const result = await authService.login(loginUserDto);

      expect(authService.validateUser).toHaveBeenCalledWith(loginUserDto);
      expect(mockJwtService.sign).toHaveBeenCalledWith({ email: user.email, sub: user.id });
      expect(result).toEqual({ access_token: 'signed-jwt-token' });
    });

    it('should throw an error if validation fails', async () => {
      const loginUserDto: LoginUserDto = { email: 'test@example.com', password: 'password' };

      jest.spyOn(authService, 'validateUser').mockRejectedValue(new UnauthorizedException());

      await expect(authService.login(loginUserDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateUser', () => {
    it('should return the user if validation succeeds', async () => {
      const loginUserDto: LoginUserDto = { email: 'test@example.com', password: 'password' };
      const user = { id: 1, email: loginUserDto.email, password: 'hashedPassword' };

      mockUserRepository.findOne.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await authService.validateUser(loginUserDto);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginUserDto.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginUserDto.password, user.password);
      expect(result).toEqual(user);
    });

    it('should throw an error if password is incorrect', async () => {
      const loginUserDto: LoginUserDto = { email: 'test@example.com', password: 'wrong-password' };
      const user = { id: 1, email: loginUserDto.email, password: 'hashedPassword' };

      mockUserRepository.findOne.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(authService.validateUser(loginUserDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw an error if no user is found', async () => {
      const loginUserDto: LoginUserDto = { email: 'test@example.com', password: 'password' };

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(authService.validateUser(loginUserDto)).rejects.toThrow(BadRequestException);
    });
  });
});
