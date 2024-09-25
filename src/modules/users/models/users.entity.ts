import { Entity, Column, OneToMany } from 'typeorm';
import { IsEmail, MinLength } from 'class-validator';
import { BaseEntity } from '../../base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { OrderEntity } from '../../orders/models/orders.entity';
import { Exclude } from 'class-transformer';

@Entity("users")
export class UserEntity extends BaseEntity {

  @ApiProperty({ example: 'email@example.com', description: 'Unique email' })
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'test1234', description: 'Password' })
  @Column()
  @MinLength(8)
  @Exclude()
  password: string;

  @OneToMany(() => OrderEntity, (order) => order.user, {
    onDelete: 'CASCADE',
  })
  orders: OrderEntity[];
}