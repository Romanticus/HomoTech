// films.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FilmsRepository } from 'src/repository/films.repository';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { Schedule } from './entities/schedule.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Film } from './entities/film.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Film, Schedule])],
  providers: [
    // {
    //   provide: 'DATABASE_CONNECTION',
    //   useFactory: async (config: ConfigService) => {
    //     const url = config.get<string>('DATABASE_URL');
    //     return mongoose.connect(url);
    //   },
    //   inject: [ConfigService],
    // },
    FilmsRepository,
    FilmsService,
  ],
  exports: [FilmsRepository],
  controllers: [FilmsController],
})
export class FilmsModule {}
