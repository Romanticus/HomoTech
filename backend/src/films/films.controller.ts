import { Controller, Get, Param } from '@nestjs/common';
import { FilmListResponseDTO } from './dto/films.dto';
import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async getAllFilms(): Promise<FilmListResponseDTO> {
    return this.filmsService.getAllFilms();
  }
  @Get(':id/schedule')
  async getFilmShedule(@Param('id') id: string) {
    return this.filmsService.getFilmShedule(id);
  }
}
