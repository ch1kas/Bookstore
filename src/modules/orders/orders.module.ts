import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderEntity } from "./models/orders.entity";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { OrderListener } from "./order-event-listener";
import { KafkaModule } from "../kafka/kafka.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity]),
    KafkaModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderListener],
  exports: [OrdersService]
})
export class OrdersModule {}