import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: 'email@example.com', description: 'Email of the user' })
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Password of the user' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}