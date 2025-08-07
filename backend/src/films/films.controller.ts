import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CreateFilmDTO, CreateScheduleDTO, FilmDTO, FilmListResponseDTO, SheduleDTO, UpdateFilmDTO } from './dto/films.dto';
import { FilmsService } from './films.service';
import { AdminGuard } from 'src/guards/admin.guard';

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
  
  @Post('admin')
  @UseGuards(AdminGuard)
  async createFilm(@Body() dto: CreateFilmDTO): Promise<FilmDTO> {
    return this.filmsService.createFilm(dto);
  }

  // @Put('admin/:id')
  // @UseGuards(AdminGuard)
  // async updateFilm(
  //   @Param('id') id: string,
  //   @Body() dto: UpdateFilmDTO
  // ): Promise<FilmDTO> {
  //   return this.filmsService.updateFilm(id, dto);
  // }

  @Post('admin/:id/schedule')
  @UseGuards(AdminGuard)
  async createSchedule(
    @Param('id') filmId: string,
    @Body() dto: CreateScheduleDTO
  ): Promise<SheduleDTO> {
    return this.filmsService.createSchedule(filmId, dto);
  }
}
