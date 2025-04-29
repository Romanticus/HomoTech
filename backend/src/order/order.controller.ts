import { Body, Controller, Post } from '@nestjs/common';
import { CreateOrderDto, OrderResponse } from './dto/order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<OrderResponse> {
    return this.orderService.createOrder(createOrderDto);
  }
}
