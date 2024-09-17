import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { Public } from './decorators/public.decorator';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Sign Up' })
  @ApiResponse({ status: 201, description: 'Creates a user' })
  @Post('register')
  @Public()
  async register(@Body() userDto: CreateUserDto) {
    return this.authService.register(userDto);
  }

  @ApiOperation({ summary: 'Sign In' })
  @ApiResponse({ status: 201, description: 'Returns a jwt token' })
  @Post('login')
  @Public()
  async login(@Body() userDto: LoginUserDto) {
    return this.authService.login(userDto);
  }
}
