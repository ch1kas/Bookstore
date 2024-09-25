import { Test, TestingModule } from '@nestjs/testing';
import { OrderListener } from './order-event-listener';
import { ConsumerService } from '../kafka/consumer.service';
import { OrdersService } from './orders.service';

describe('OrderListener', () => {
  let orderListener: OrderListener;
  let consumerService: ConsumerService;
  let ordersService: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderListener,
        {
          provide: ConsumerService,
          useValue: {
            consume: jest.fn(),
          },
        },
        {
          provide: OrdersService,
          useValue: {
            findOne: jest.fn(),
            updateStatus: jest.fn(),
          },
        },
      ],
    }).compile();

    orderListener = module.get<OrderListener>(OrderListener);
    consumerService = module.get<ConsumerService>(ConsumerService);
    ordersService = module.get<OrdersService>(OrdersService);
  });

  it('should update order status to "created" on order_created event', async () => {
    const mockOrder = { id: 1 };
    const message = {
      topic: 'order_created',
      partition: 0,
      message: { value: JSON.stringify(mockOrder) },
    };

    // Mock methods
    (consumerService.consume as jest.Mock).mockImplementation((_topics, config) => {
      config.eachMessage(message);
    });
    (ordersService.findOne as jest.Mock).mockResolvedValue(mockOrder);

    // Call onModuleInit (which will trigger Kafka consumer setup)
    await orderListener.onModuleInit();

    expect(ordersService.findOne).toHaveBeenCalledWith(1);
    expect(ordersService.updateStatus).toHaveBeenCalledWith(1, 'created');
  });

  it('should update order status to "updated" on order_updated event', async () => {
    const mockOrder = { id: 1 };
    const message = {
      topic: 'order_updated',
      partition: 0,
      message: { value: JSON.stringify(mockOrder) },
    };

    // Mock methods
    (consumerService.consume as jest.Mock).mockImplementation((_topics, config) => {
      config.eachMessage(message);
    });
    (ordersService.findOne as jest.Mock).mockResolvedValue(mockOrder);

    // Call onModuleInit (which will trigger Kafka consumer setup)
    await orderListener.onModuleInit();

    expect(ordersService.findOne).toHaveBeenCalledWith(1);
    expect(ordersService.updateStatus).toHaveBeenCalledWith(1, 'updated');
  });

  it('should log error if order is not found', async () => {
    const mockOrder = { id: 1 };
    const message = {
      topic: 'order_created',
      partition: 0,
      message: { value: JSON.stringify(mockOrder) },
    };

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    // Mock methods
    (consumerService.consume as jest.Mock).mockImplementation((_topics, config) => {
      config.eachMessage(message);
    });
    (ordersService.findOne as jest.Mock).mockResolvedValue(null); // Simulate order not found

    // Call onModuleInit
    await orderListener.onModuleInit();

    expect(ordersService.findOne).toHaveBeenCalledWith(1);
    expect(ordersService.updateStatus).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Order with ID 1 not found.');
    
    consoleErrorSpy.mockRestore(); // Restore console.error
  });

  it('should log error if updating status fails', async () => {
    const mockOrder = { id: 1 };
    const message = {
      topic: 'order_created',
      partition: 0,
      message: { value: JSON.stringify(mockOrder) },
    };

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const mockError = new Error('Update failed');

    // Mock methods
    (consumerService.consume as jest.Mock).mockImplementation((_topics, config) => {
      config.eachMessage(message);
    });
    (ordersService.findOne as jest.Mock).mockResolvedValue(mockOrder);
    (ordersService.updateStatus as jest.Mock).mockRejectedValue(mockError);

    // Call onModuleInit
    await orderListener.onModuleInit();

    expect(ordersService.findOne).toHaveBeenCalledWith(1);
    expect(ordersService.updateStatus).toHaveBeenCalledWith(1, 'created');
    expect(consoleErrorSpy).toHaveBeenCalledWith(`Failed to update order status: ${mockError.message}`);

    consoleErrorSpy.mockRestore();
  });
});
