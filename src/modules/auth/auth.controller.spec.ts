import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should call AuthService.register and return the result', async () => {
      const createUserDto: CreateUserDto = { email: 'test@example.com', password: 'password' };
      const mockResult = { id: 1, email: createUserDto.email };

      mockAuthService.register.mockResolvedValue(mockResult);

      const result = await authController.register(createUserDto);

      expect(authService.register).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockResult);
    });

    it('should throw an error if registration fails', async () => {
      const createUserDto: CreateUserDto = { email: 'test@example.com', password: 'password' };
      
      mockAuthService.register.mockRejectedValue(new Error('Registration failed'));

      await expect(authController.register(createUserDto)).rejects.toThrow(Error);
    });
  });

  describe('login', () => {
    it('should call AuthService.login and return the jwt token', async () => {
      const loginUserDto: LoginUserDto = { email: 'test@example.com', password: 'password' };
      const mockToken = { access_token: 'jwt-token' };

      mockAuthService.login.mockResolvedValue(mockToken);

      const result = await authController.login(loginUserDto);

      expect(authService.login).toHaveBeenCalledWith(loginUserDto);
      expect(result).toEqual(mockToken);
    });

    it('should throw an error if login fails', async () => {
      const loginUserDto: LoginUserDto = { email: 'test@example.com', password: 'password' };

      mockAuthService.login.mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      await expect(authController.login(loginUserDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
