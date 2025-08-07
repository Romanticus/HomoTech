// ../films/films.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateDataBaseOrderDto,
  CreateFilmDTO,
  CreateScheduleDTO,
  FilmDTO,
  FilmListResponseDTO,
  FilmSheduleDTO,
  SheduleDTO,
} from '../films/dto/films.dto';
import { Film } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';
import { CreateOrderDto, TicketDto } from '../order/dto/order.dto';
import { Repository } from 'typeorm';
import { Ticket } from '../films/entities/ticket.entity';
import { Order } from '../films/entities/order.entity';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  mapFilmToDTO(film: Film): FilmDTO {
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
  mapScheduleToDTO(schedule: Schedule): SheduleDTO {
    return {
      id: schedule.id,
      daytime: schedule.daytime,
      hall: schedule.hall,
      rows: schedule.rows,
      seats: schedule.seats,
      price: schedule.price,
      taken: schedule.taken || [],
    };
  }

  async createFilm(dto: CreateFilmDTO): Promise<Film> {
    const film = this.filmRepository.create(dto);
    return this.filmRepository.save(film);
  }

  async findFilm(id: string): Promise<FilmDTO> {
    const film = await this.filmRepository.findOne({
      where: { id },
    });

    if (!film) {
      throw new Error('Film Not Found');
    }
    const mappedFilm = this.mapFilmToDTO(film);
    return mappedFilm;
  }
  async createSchedule(
    filmId: string,
    dto: CreateScheduleDTO,
  ): Promise<Schedule> {
    const film = await this.filmRepository.findOneBy({ id: filmId });
    if (!film) throw new Error('Фильм не найден');

    const schedule = this.scheduleRepository.create({
      ...dto,
      film,
      taken: [],
    });

    return this.scheduleRepository.save(schedule);
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
  async createOrder(dto: CreateOrderDto): Promise<Order> {
    const newOrder = this.orderRepository.create({
      email: dto.email,
      phone: dto.phone,
      total: dto.tickets.reduce((sum, t) => sum + t.price, 0),
    });
    const savedOrder = await this.orderRepository.save(newOrder);

    const ticketsToSave = dto.tickets.map((ticket) =>
      this.ticketRepository.create({
        ...ticket,
        film_id: ticket.film,
        session_id: ticket.session,
        session_time: ticket.daytime,
        order: savedOrder,
      }),
    ); 
    await this.ticketRepository.save(ticketsToSave);

    return savedOrder;
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
