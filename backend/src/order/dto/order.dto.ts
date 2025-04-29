//TODO реализовать DTO для /orders
// order.dto.ts

export class TicketDto {
  film: string;

  session: string;

  daytime: Date;
  row: number;
  seat: number;
  price: number;
}

export class CreateOrderDto {
  email: string;
  phone: string;
  tickets: TicketDto[];
}

export class OrderResponse {
  total: number;
  items: Array<TicketDto & { id: string }>;
}
