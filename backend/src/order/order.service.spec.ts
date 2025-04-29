import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { FilmsRepository } from '../repository/films.repository';
import { CreateOrderDto, TicketDto } from './dto/order.dto';
import { BadRequestException } from '@nestjs/common';

// Мокируем FilmsRepository
jest.mock('../repository/films.repository', () => {
  return {
    FilmsRepository: jest.fn().mockImplementation(() => {
      return {
        findFilmSchedule: jest.fn(),
        reserveSeats: jest.fn(),
      };
    }),
  };
});

// Мокируем uuid из uuidv4
jest.mock('uuidv4', () => ({
  uuid: jest.fn().mockReturnValue('mocked-uuid'),
}));

describe('OrderService', () => {
  let service: OrderService;
  let filmsRepository: FilmsRepository;

  // Моковые данные
  const mockTickets: TicketDto[] = [
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
  ];

  const mockCreateOrderDto: CreateOrderDto = {
    email: 'test@example.com',
    phone: '+71234567890',
    tickets: mockTickets,
  };

  const mockSchedule = {
    total: 1,
    items: [
      {
        id: 'session1',
        daytime: new Date('2023-05-15T18:00:00'),
        hall: 1,
        rows: 10,
        seats: 20,
        price: 350,
        taken: [],
      },
    ],
  };

  beforeEach(async () => {
    // Сбрасываем все моки
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderService, FilmsRepository],
    }).compile();

    service = module.get<OrderService>(OrderService);
    filmsRepository = module.get<FilmsRepository>(FilmsRepository);

    // Настраиваем моки
    jest
      .spyOn(filmsRepository, 'findFilmSchedule')
      .mockResolvedValue(mockSchedule);
    jest.spyOn(filmsRepository, 'reserveSeats').mockResolvedValue({
      id: 'session1',
      daytime: new Date('2023-05-15T18:00:00'),
      hall: 1,
      rows: 10,
      seats: 20,
      price: 350,
      taken: ['5-10', '5-11'],
    } as any);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create an order successfully', async () => {
      const result = await service.createOrder(mockCreateOrderDto);

      expect(filmsRepository.reserveSeats).toHaveBeenCalledWith(
        'Film 1',
        'session1',
        mockTickets,
      );
      expect(result.total).toBe(2);
      expect(result.items.length).toBe(2);
      expect(result.items[0].id).toBeDefined();
    });

    it('should throw an error when no tickets provided', async () => {
      const invalidOrder = {
        email: 'test@example.com',
        phone: '+71234567890',
        tickets: [],
      } as CreateOrderDto;

      await expect(service.createOrder(invalidOrder)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw an error when reservation fails', async () => {
      jest
        .spyOn(filmsRepository, 'reserveSeats')
        .mockRejectedValueOnce(new Error('Сеанс не найден'));

      await expect(service.createOrder(mockCreateOrderDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(filmsRepository.reserveSeats).toHaveBeenCalledWith(
        'Film 1',
        'session1',
        mockTickets,
      );
    });
  });
});
