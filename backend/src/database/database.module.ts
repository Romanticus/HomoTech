import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm'; // Добавляем импорт
import { Film } from 'src/films/entities/film.entity';
import { Schedule } from 'src/films/entities/schedule.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): DataSourceOptions => {
        // Явно указываем тип
        const driver = config.get<'postgres' | 'sqlite'>(
          'DATABASE_DRIVER',
          'postgres',
        );

        return {
          type: driver,
          host: config.get<string>('DATABASE_HOST'), // Явное указание типа
          port: config.get<number>('DATABASE_PORT'),
          username: config.get<string>('DATABASE_USERNAME'),
          password: config.get<string>('DATABASE_PASSWORD'), // Фикс здесь
          database: config.get<string>('DATABASE_NAME'),
          entities: [Film, Schedule],
          synchronize: false,
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
