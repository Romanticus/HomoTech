import { Injectable } from '@nestjs/common';

import { FilmListResponseDTO, FilmSheduleDTO } from './dto/films.dto';
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
}
