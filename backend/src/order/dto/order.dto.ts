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
export class TicketDTO {
  id: string;
  film_id: string;
  session_id: string;
  row: number;
  seat: number;
  price: number;
  session_time: Date;
}

export class OrderResponseDTO {
  id: string;
  email: string;
  phone: string;
  total: number;
  created_at: Date;
  tickets: TicketDTO[];
}

export class OrderListResponseDTO {
  total:number;
  items: OrderResponseDTO[];
}
