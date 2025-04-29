import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { FilmsRepository } from '../repository/films.repository';
import { FilmListResponseDTO, FilmSheduleDTO } from './dto/films.dto';

// Мокируем FilmsRepository
jest.mock('../repository/films.repository', () => {
  return {
    FilmsRepository: jest.fn().mockImplementation(() => {
      return {
        findAll: jest.fn(),
        findFilmSchedule: jest.fn(),
      };
    }),
  };
});

describe('FilmsService', () => {
  let service: FilmsService;
  let filmsRepository: FilmsRepository;

  // Моковые данные
  const mockFilmsList: FilmListResponseDTO = {
    total: 2,
    items: [
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
      },
    ],
  };

  const mockFilmSchedule: FilmSheduleDTO = {
    total: 2,
    items: [
      {
        id: 'schedule1',
        daytime: new Date('2023-05-15T18:00:00'),
        hall: 1,
        rows: 10,
        seats: 20,
        price: 350,
        taken: ['1-1', '1-2'],
      },
      {
        id: 'schedule2',
        daytime: new Date('2023-05-15T21:00:00'),
        hall: 2,
        rows: 12,
        seats: 22,
        price: 400,
        taken: ['3-5', '3-6'],
      },
    ],
  };

  beforeEach(async () => {
    // Сбрасываем все моки
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [FilmsService, FilmsRepository],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
    filmsRepository = module.get<FilmsRepository>(FilmsRepository);

    // Настраиваем моки
    jest.spyOn(filmsRepository, 'findAll').mockResolvedValue(mockFilmsList);
    jest
      .spyOn(filmsRepository, 'findFilmSchedule')
      .mockResolvedValue(mockFilmSchedule);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllFilms', () => {
    it('should return all films', async () => {
      const result = await service.getAllFilms();

      expect(filmsRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockFilmsList);
      expect(result.total).toBe(2);
      expect(result.items.length).toBe(2);
    });
  });

  describe('getFilmShedule', () => {
    it('should return schedule for a specific film', async () => {
      const filmId = '1';
      const result = await service.getFilmShedule(filmId);

      expect(filmsRepository.findFilmSchedule).toHaveBeenCalledWith(filmId);
      expect(result).toEqual(mockFilmSchedule);
    });

    it('should throw an error when film not found', async () => {
      const filmId = 'nonexistent';
      jest
        .spyOn(filmsRepository, 'findFilmSchedule')
        .mockRejectedValueOnce(new Error('Фильм не найден'));

      await expect(service.getFilmShedule(filmId)).rejects.toThrow(
        'Фильм не найден',
      );
      expect(filmsRepository.findFilmSchedule).toHaveBeenCalledWith(filmId);
    });
  });
});
