import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsString, IsDate } from 'class-validator';
import { BaseEntity } from '../../base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class BookEntity extends BaseEntity {
  @ApiProperty({ example: '1984', description: 'Title of the books' })
  @Column()
  @IsString()
  title: string;

  @ApiProperty({ example: 'George Orwell', description: 'Author of the book' })
  @Column()
  @IsString()
  author: string;

  @ApiProperty({ example: '1949', description: 'Date the book was published' })
  @Column()
  @IsDate()
  publicationDate: Date;
}