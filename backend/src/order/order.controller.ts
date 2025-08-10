import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateOrderDto, OrderListResponseDTO, OrderResponse } from './dto/order.dto';
import { OrderService } from './order.service';
import { AdminGuard } from '../guards/admin.guard';
import { CreateFilmDTO, FilmDTO } from 'src/films/dto/films.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<OrderResponse> {
    return this.orderService.createOrder(createOrderDto);
  }
   @Get('admin')
    @UseGuards(AdminGuard)
     async getAllOrders(): Promise<OrderListResponseDTO> {
    return this.orderService.getAllOrders();
  }
  
}
