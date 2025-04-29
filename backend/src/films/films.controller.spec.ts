import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmListResponseDTO, FilmSheduleDTO } from './dto/films.dto';

// Мокируем FilmsService полностью
jest.mock('./films.service', () => {
  return {
    FilmsService: jest.fn().mockImplementation(() => {
      return {
        getAllFilms: jest.fn(),
        getFilmShedule: jest.fn(),
      };
    }),
  };
});

describe('FilmsController', () => {
  let controller: FilmsController;
  let filmsService: FilmsService;

  // Mock data
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
      controllers: [FilmsController],
      providers: [FilmsService],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    filmsService = module.get<FilmsService>(FilmsService);

    // Настраиваем реализацию моков
    jest.spyOn(filmsService, 'getAllFilms').mockResolvedValue(mockFilmsList);
    jest
      .spyOn(filmsService, 'getFilmShedule')
      .mockResolvedValue(mockFilmSchedule);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllFilms', () => {
    it('should return an array of films', async () => {
      const result = await controller.getAllFilms();

      expect(filmsService.getAllFilms).toHaveBeenCalled();
      expect(result).toEqual(mockFilmsList);
      expect(result.total).toBe(2);
      expect(result.items.length).toBe(2);
      expect(result.items[0].title).toBe('Film 1');
    });
  });

  describe('getFilmShedule', () => {
    it('should return the schedule for a specific film', async () => {
      const filmId = '1';
      const result = await controller.getFilmShedule(filmId);

      expect(filmsService.getFilmShedule).toHaveBeenCalledWith(filmId);
      expect(result).toEqual(mockFilmSchedule);
      expect(result.total).toBe(2);
      expect(result.items.length).toBe(2);
      expect(result.items[0].hall).toBe(1);
    });

    it('should handle errors when film is not found', async () => {
      const filmId = 'nonexistent';
      jest
        .spyOn(filmsService, 'getFilmShedule')
        .mockRejectedValueOnce(new Error('Фильм не найден'));

      await expect(controller.getFilmShedule(filmId)).rejects.toThrow(
        'Фильм не найден',
      );
      expect(filmsService.getFilmShedule).toHaveBeenCalledWith(filmId);
    });
  });
});
