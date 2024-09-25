import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './models/orders.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ProducerService } from '../kafka/producer.service';


@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly ordersRepository: Repository<OrderEntity>,
    private readonly producerService: ProducerService
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<OrderEntity> {
    const order = this.ordersRepository.create(createOrderDto);
    const savedOrder = await this.ordersRepository.save(order);

    this.producerService.produce({
      topic: 'order_created',
      messages: [{ value: JSON.stringify(savedOrder) }]
    })
    return savedOrder;
  }

  async findAll(): Promise<OrderEntity[]> {
    return await this.ordersRepository.find({ relations: ['book', 'user'] });
  }

  async findOne(id: number): Promise<OrderEntity> {
    await this.doesOrderExist(id);
    return await this.ordersRepository.findOne({ where: { id }, relations: ['book', 'user'] });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<OrderEntity> {
    await this.doesOrderExist(id);
    const order = await this.ordersRepository.save({ ...updateOrderDto, id });

    this.producerService.produce({
      topic: 'order_updated',
      messages: [{ value: JSON.stringify(order) }]
    })
    return order;
  }

  async updateStatus(id: number, status: string) {
    await this.ordersRepository.save({ status, id });
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.doesOrderExist(id);
    await this.ordersRepository.delete(id);
    return {
      message: 'Order deleted successfully!',
    };
  }

  async doesOrderExist(id: number): Promise<boolean> {
    const book = await this.ordersRepository.findOneBy({ id });
    if (!book) {
      throw new BadRequestException({
        message: 'Order with provided id does not exist!',
      });
    }
    return true;
  }
}