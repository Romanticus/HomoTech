import { Test, TestingModule } from '@nestjs/testing';
import { FilmsRepository } from './films.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Film } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';
import { Repository } from 'typeorm';

// Мокируем TypeORM репозитории
const queryBuilder = {
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
};

const mockFilmRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
};

const mockScheduleRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
};

describe('FilmsRepository', () => {
  let repository: FilmsRepository;
  let filmRepository: Repository<Film>;
  let scheduleRepository: Repository<Schedule>;

  // Моковые данные
  const mockFilms = [
    {
      id: '1',
      rating: 8.5,
      director: 'Director 1',
      tags: ['drama', 'thriller'],
      title: 'Film 1',
      about: 'About film 1',
      description: 'Description of film 1',
      image: 'image1.jpg',
      cover: 'cover1.jpg',
      schedules: [],
    },
    {
      id: '2',
      rating: 7.9,
      director: 'Director 2',
      tags: ['comedy', 'action'],
      title: 'Film 2',
      about: 'About film 2',
      description: 'Description of film 2',
      image: 'image2.jpg',
      cover: 'cover2.jpg',
      schedules: [],
    },
  ];

  const mockSchedules = [
    {
      id: 'schedule1',
      film: mockFilms[0],
      daytime: new Date('2023-05-15T18:00:00'),
      hall: 1,
      rows: 10,
      seats: 20,
      price: 350,
      taken: ['1-1', '1-2'],
    },
    {
      id: 'schedule2',
      film: mockFilms[0],
      daytime: new Date('2023-05-15T21:00:00'),
      hall: 2,
      rows: 12,
      seats: 22,
      price: 400,
      taken: ['3-5', '3-6'],
    },
  ];

  // Добавляем расписания к фильму
  mockFilms[0].schedules = mockSchedules;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsRepository,
        {
          provide: getRepositoryToken(Film),
          useValue: mockFilmRepository,
        },
        {
          provide: getRepositoryToken(Schedule),
          useValue: mockScheduleRepository,
        },
      ],
    }).compile();

    repository = module.get<FilmsRepository>(FilmsRepository);
    filmRepository = module.get<Repository<Film>>(getRepositoryToken(Film));
    scheduleRepository = module.get<Repository<Schedule>>(
      getRepositoryToken(Schedule),
    );

    // Сбрасываем моки
    jest.clearAllMocks();

    // Настраиваем моки для всего набора тестов
    queryBuilder.getManyAndCount.mockResolvedValue([
      mockFilms,
      mockFilms.length,
    ]);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all films', async () => {
      const result = await repository.findAll();

      expect(filmRepository.createQueryBuilder).toHaveBeenCalledWith('film');
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'film.schedules',
        'schedules',
      );
      expect(result.total).toBe(2);
      expect(result.items.length).toBe(2);
    });
  });

  describe('findFilmSchedule', () => {
    it('should return a film schedule', async () => {
      mockFilmRepository.findOne.mockResolvedValue(mockFilms[0]);

      const result = await repository.findFilmSchedule('1');

      expect(filmRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['schedules'],
        order: {
          schedules: {
            daytime: 'ASC',
          },
        },
      });
      expect(result.total).toBe(2);
      expect(result.items.length).toBe(2);
    });

    it('should throw an error when film not found', async () => {
      mockFilmRepository.findOne.mockResolvedValue(null);

      await expect(repository.findFilmSchedule('nonexistent')).rejects.toThrow(
        'Film Not Found',
      );
      expect(filmRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('reserveSeats', () => {
    it('should reserve seats successfully', async () => {
      const filmId = '1';
      const sessionId = 'schedule1';
      const tickets = [
        {
          film: 'Film 1',
          session: 'session1',
          daytime: new Date(),
          row: 5,
          seat: 15,
          price: 350,
        },
      ];

      const mockSchedule = {
        id: sessionId,
        film: { id: filmId },
        taken: ['1-1'],
        price: 350,
      };

      mockScheduleRepository.findOne.mockResolvedValue(mockSchedule);
      mockScheduleRepository.save.mockResolvedValue({
        ...mockSchedule,
        taken: [...mockSchedule.taken, '5:15'],
      });

      const result = await repository.reserveSeats(filmId, sessionId, tickets);

      expect(scheduleRepository.findOne).toHaveBeenCalledWith({
        where: { id: sessionId, film: { id: filmId } },
      });
      expect(scheduleRepository.save).toHaveBeenCalled();
      expect(result.taken).toContain('5:15');
    });

    it('should throw error if session not found', async () => {
      const filmId = '1';
      const sessionId = 'nonexistent';
      const tickets = [
        {
          film: 'Film 1',
          session: 'session1',
          daytime: new Date(),
          row: 5,
          seat: 15,
          price: 350,
        },
      ];

      mockScheduleRepository.findOne.mockResolvedValue(null);

      await expect(
        repository.reserveSeats(filmId, sessionId, tickets),
      ).rejects.toThrow('Сеанс не найден');
      expect(scheduleRepository.findOne).toHaveBeenCalled();
    });

    it('should throw error for duplicate seats', async () => {
      const filmId = '1';
      const sessionId = 'schedule1';
      const tickets = [
        {
          film: 'Film 1',
          session: 'session1',
          daytime: new Date(),
          row: 5,
          seat: 15,
          price: 350,
        },
        {
          film: 'Film 1',
          session: 'session1',
          daytime: new Date(),
          row: 5,
          seat: 15,
          price: 350,
        },
      ];

      const mockSchedule = {
        id: sessionId,
        film: { id: filmId },
        taken: [],
        price: 350,
      };

      mockScheduleRepository.findOne.mockResolvedValue(mockSchedule);

      await expect(
        repository.reserveSeats(filmId, sessionId, tickets),
      ).rejects.toThrow('Дубликаты мест в запросе');
      expect(scheduleRepository.findOne).toHaveBeenCalled();
    });

    it('should throw error for already taken seats', async () => {
      const filmId = '1';
      const sessionId = 'schedule1';
      const tickets = [
        {
          film: 'Film 1',
          session: 'session1',
          daytime: new Date(),
          row: 1,
          seat: 1,
          price: 350,
        },
      ];

      const mockSchedule = {
        id: sessionId,
        film: { id: filmId },
        taken: ['1:1'],
        price: 350,
      };

      mockScheduleRepository.findOne.mockResolvedValue(mockSchedule);

      await expect(
        repository.reserveSeats(filmId, sessionId, tickets),
      ).rejects.toThrow('Занятые места');
      expect(scheduleRepository.findOne).toHaveBeenCalled();
    });
  });
});
