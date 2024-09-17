import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseEntity {
  @ApiProperty({
    example: '1',
    description: 'Id of the record',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '23-09-24',
    description: 'Time the record was created at',
  })
  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  created_at: Date;

  @ApiProperty({
    example: '23-09-24',
    description: 'Time the record was updated at',
  })
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  updated_at: Date;
}
