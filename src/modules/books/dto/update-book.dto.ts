import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class UpdateBookDto {
  @ApiProperty({ example: '1984', description: 'Title of a book' })
  @IsString()
  title?: string;

  @ApiProperty({ example: 'George Orwell', description: 'Author of a book' })
  @IsString()
  author?: string;

  @ApiProperty({ example: '1949-06-08', description: 'Date the book was published' })
  publicationDate?: Date;
}