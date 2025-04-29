// order.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import { uuid } from 'uuidv4';
import { CreateOrderDto, OrderResponse } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async createOrder(dto: CreateOrderDto): Promise<OrderResponse> {
    const { tickets } = dto;

    if (!tickets?.length) {
      throw new BadRequestException('Минимум один билет требуется для заказа');
    }

    const firstTicket = tickets[0];

    try {
      await this.filmsRepository.reserveSeats(
        firstTicket.film,
        firstTicket.session,
        tickets,
      );

      return {
        total: tickets.length,
        items: tickets.map((ticket) => ({
          ...ticket,
          id: uuid(),
        })),
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
