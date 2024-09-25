import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConsumerService } from "../kafka/consumer.service";
import { OrdersService } from "./orders.service";

@Injectable()
export class OrderListener implements OnModuleInit {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly orderService: OrdersService
  ) {}

  async onModuleInit() {
    await this.consumerService.consume(
      { topics: ['order_created', 'order_updated'] },
      {
        eachMessage: async ({ topic, partition, message }) => {
          const orderData = JSON.parse(message.value.toString());

          switch (topic) {
            case 'order_created':
              await this.updateOrderStatus(orderData.id, 'created');
              break;

            case 'order_updated':
              await this.updateOrderStatus(orderData.id, 'updated');
              break;

            default:
              console.log(`Unhandled topic: ${topic}`);
          }
        }
      }
    )
  }

  private async updateOrderStatus(orderId: number, status: string) {
    try {
      const order = await this.orderService.findOne(orderId);
      if (order) {
        await this.orderService.updateStatus(orderId, status);
        console.log(`Order ${orderId} status updated to ${status}`);
      } else {
        console.error(`Order with ID ${orderId} not found.`);
      }
    } catch (error) {
      console.error(`Failed to update order status: ${error.message}`);
    }
  }
} 