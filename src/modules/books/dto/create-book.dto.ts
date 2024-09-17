import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class CreateBookDto {
  @ApiProperty({ example: '1984', description: 'Title of a book' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'George Orwell', description: 'Author of a book' })
  @IsNotEmpty()
  @IsString()
  author: string;

  @ApiProperty({ example: '1949-06-08', description: 'Date the book was published' })
  @IsNotEmpty()
  publicationDate: Date;
}