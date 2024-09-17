import { Entity, Column } from 'typeorm';
import { IsEmail, MinLength } from 'class-validator';
import { BaseEntity } from '../../base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class UserEntity extends BaseEntity {

  @ApiProperty({ example: 'email@example.com', description: 'Unique email' })
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'test1234', description: 'Password' })
  @Column()
  @MinLength(8)
  password: string;
}