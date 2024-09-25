import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { BookEntity } from "src/modules/books/models/books.entity";
import { UserEntity } from "src/modules/users/models/users.entity";

export class UpdateOrderDto {
  @ApiProperty({ example: '10', description: 'Amount of books ordered' })
  @IsNumber()
  amount?: number;

  user?: UserEntity;
  
  book?: BookEntity;
}