import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderEntity } from './models/orders.entity';
import { OrdersService } from './orders.service';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Create an order' })
  @ApiResponse({ status: 201 })
  @Post()
  create(@Body() createOrderDto: CreateOrderDto): Promise<OrderEntity> {
    return this.ordersService.create(createOrderDto);
  }

  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200 })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  findAll(): Promise<OrderEntity[]> {
    return this.ordersService.findAll();
  }

  @ApiOperation({ summary: 'Get order by id' })
  @ApiResponse({ status: 200 })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<OrderEntity> {
    return this.ordersService.findOne(id);
  }

  @ApiOperation({ summary: 'Update an order by id' })
  @ApiResponse({ status: 200 })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateOrderDto: UpdateOrderDto
  ): Promise<OrderEntity> {
    return this.ordersService.update(id, updateOrderDto);
  }

  @ApiOperation({ summary: 'Delete an order by id' })
  @ApiResponse({ status: 200, description: 'Returns success message' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.ordersService.remove(id);
  }
}
