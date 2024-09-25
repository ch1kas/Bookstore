import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../../modules/users/models/users.entity';
import { BookEntity } from '../../../modules/books/models/books.entity';

@Entity("orders")
export class OrderEntity extends BaseEntity {

  @ApiProperty({ example: '10', description: 'Amount of books ordered' })
  @Column()
  amount: number;
  
  @ApiProperty({ example: 'shipped', description: 'Status of an order' })
  @Column({ default: 'pending' })
  status: string;

  @ManyToOne(() => UserEntity, (user) => user.orders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => BookEntity, (book) => book.orders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'bookId' })
  book: BookEntity;
}