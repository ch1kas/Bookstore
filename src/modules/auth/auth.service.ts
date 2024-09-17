import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../users/models/users.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from '../users/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    private jwtService: JwtService
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const isEmailInUse = await this.userRepository.findOne({
      where: {email: email},
    });
    if (isEmailInUse) {
      throw new BadRequestException("Email already in use");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ email: email, password: hashedPassword });
    return this.userRepository.save(user);
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(loginUserDto);
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(loginUserDto: LoginUserDto):Promise<any> {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({ where: { email: email }});
    
    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        return user;
      } else {
        throw new UnauthorizedException("Incorrect password");
      } 
    } else {
      throw new BadRequestException("No user with such email");
    }
  }
}
