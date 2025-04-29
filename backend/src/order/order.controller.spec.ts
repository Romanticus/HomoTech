import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto, OrderResponse } from './dto/order.dto';

// Мокируем OrderService полностью
jest.mock('./order.service', () => {
  return {
    OrderService: jest.fn().mockImplementation(() => {
      return {
        createOrder: jest.fn(),
      };
    }),
  };
});

describe('OrderController', () => {
  let controller: OrderController;
  let orderService: OrderService;

  // Mock data
  const mockCreateOrderDto: CreateOrderDto = {
    email: 'test@example.com',
    phone: '+71234567890',
    tickets: [
      {
        film: 'Film 1',
        session: 'session1',
        daytime: new Date('2023-05-15T18:00:00'),
        row: 5,
        seat: 10,
        price: 350,
      },
      {
        film: 'Film 1',
        session: 'session1',
        daytime: new Date('2023-05-15T18:00:00'),
        row: 5,
        seat: 11,
        price: 350,
      },
    ],
  };

  const mockOrderResponse: OrderResponse = {
    total: 2,
    items: [
      {
        id: 'ticket1',
        film: 'Film 1',
        session: 'session1',
        daytime: new Date('2023-05-15T18:00:00'),
        row: 5,
        seat: 10,
        price: 350,
      },
      {
        id: 'ticket2',
        film: 'Film 1',
        session: 'session1',
        daytime: new Date('2023-05-15T18:00:00'),
        row: 5,
        seat: 11,
        price: 350,
      },
    ],
  };

  beforeEach(async () => {
    // Сбрасываем все моки
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [OrderService],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    orderService = module.get<OrderService>(OrderService);

    // Настраиваем реализацию мока
    jest
      .spyOn(orderService, 'createOrder')
      .mockResolvedValue(mockOrderResponse);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create a new order and return the response', async () => {
      const result = await controller.createOrder(mockCreateOrderDto);

      expect(orderService.createOrder).toHaveBeenCalledWith(mockCreateOrderDto);
      expect(result).toEqual(mockOrderResponse);
      expect(result.total).toBe(2);
      expect(result.items.length).toBe(2);
      expect(result.items[0].id).toBe('ticket1');
    });

    it('should handle validation errors', async () => {
      const invalidOrder = {
        email: 'test@example.com',
        // Missing phone and tickets
      } as CreateOrderDto;

      jest
        .spyOn(orderService, 'createOrder')
        .mockRejectedValueOnce(new Error('Validation failed'));

      await expect(controller.createOrder(invalidOrder)).rejects.toThrow(
        'Validation failed',
      );
      expect(orderService.createOrder).toHaveBeenCalledWith(invalidOrder);
    });

    it('should handle service errors', async () => {
      jest
        .spyOn(orderService, 'createOrder')
        .mockRejectedValueOnce(new Error('Service error'));

      await expect(controller.createOrder(mockCreateOrderDto)).rejects.toThrow(
        'Service error',
      );
      expect(orderService.createOrder).toHaveBeenCalledWith(mockCreateOrderDto);
    });
  });
});
