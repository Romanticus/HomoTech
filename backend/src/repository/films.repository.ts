// ../films/films.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FilmDTO,
  FilmListResponseDTO,
  FilmSheduleDTO,
} from '../films/dto/films.dto';
import { Film } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';
import { TicketDto } from '../order/dto/order.dto';
import { Repository } from 'typeorm';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,

    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  private mapFilmToDTO(film: Film): FilmDTO {
    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
    };
  }

  async findAll(): Promise<FilmListResponseDTO> {
    const queryBuilder = this.filmRepository
      .createQueryBuilder('film')
      .leftJoinAndSelect('film.schedules', 'schedules');

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      total,
      items: items.map(this.mapFilmToDTO),
    };
  }
  async findFilmSchedule(id: string): Promise<FilmSheduleDTO> {
    const film = await this.filmRepository.findOne({
      where: { id },
      relations: ['schedules'],
      order: {
        schedules: {
          daytime: 'ASC',
        },
      },
    });

    if (!film) {
      throw new Error('Film Not Found');
    }

    return {
      total: film.schedules.length,
      items: film.schedules.map((schedule) => ({
        id: schedule.id,
        daytime: schedule.daytime,
        hall: schedule.hall,
        rows: schedule.rows,
        seats: schedule.seats,
        price: schedule.price,
        taken: schedule.taken || [],
      })),
    };
  }

  async reserveSeats(
    filmId: string,
    sessionId: string,
    tickets: TicketDto[],
  ): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: sessionId, film: { id: filmId } },
    });

    if (!schedule) {
      throw new Error('Сеанс не найден');
    }
    if (!schedule.taken) {
      schedule.taken = [];
    }

    const seatsToReserve = tickets.map(
      (ticket) => `${ticket.row}:${ticket.seat}`,
    );

    // Валидация дубликатов
    if (new Set(seatsToReserve).size !== tickets.length) {
      throw new Error('Дубликаты мест в запросе');
    }

    // Проверка занятых мест
    const conflicts = seatsToReserve.filter((seat) =>
      schedule.taken.includes(seat),
    );

    if (conflicts.length > 0) {
      throw new Error(`Занятые места: ${conflicts.join(', ')}`);
    }

    // Обновление данных
    schedule.taken = [...schedule.taken, ...seatsToReserve];
    schedule.price = tickets[0].price;

    return this.scheduleRepository.save(schedule);
  }
}
