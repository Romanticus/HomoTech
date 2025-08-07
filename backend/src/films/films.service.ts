import { Injectable } from '@nestjs/common';

import { CreateFilmDTO, CreateScheduleDTO, FilmDTO, FilmListResponseDTO, FilmSheduleDTO, SheduleDTO } from './dto/films.dto';
import { FilmsRepository } from '../repository/films.repository';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async getAllFilms(): Promise<FilmListResponseDTO> {
    return this.filmsRepository.findAll();
  }

  async getFilmShedule(id: string): Promise<FilmSheduleDTO> {
    try {
      return this.filmsRepository.findFilmSchedule(id);
    } catch (e) {
      throw new Error('Фильм не найден');
    }
  }
  
  
  async createFilm(dto: CreateFilmDTO): Promise<FilmDTO> {
    const film = await this.filmsRepository.createFilm(dto);
    return this.filmsRepository.mapFilmToDTO(film);
  }

  async createSchedule(filmId: string, dto: CreateScheduleDTO): Promise<SheduleDTO> {
    const schedule = await this.filmsRepository.createSchedule(filmId, dto);
    return this.filmsRepository.mapScheduleToDTO(schedule);
  }
}
