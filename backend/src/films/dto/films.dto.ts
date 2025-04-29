//TODO описать DTO для запросов к /films
// TODO: описать DTO для запросов к /films
export class FilmListResponseDTO {
  total: number; // Общее количество фильмов
  items: FilmDTO[]; // Список фильмов
}

export class FilmDTO {
  id: string; // Идентификатор фильма (UUID)
  rating: number; // Рейтинг фильма
  director: string; // Режиссер
  tags: string[]; // Теги фильма
  title: string; // Название фильма
  about: string; // Краткое описание
  description: string; // Полное описание
  image: string; // URL изображения
  cover: string; // URL обложки
}
export class SheduleDTO {
  id: string;
  daytime: Date;
  hall: number;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
}

export class FilmSheduleDTO {
  total: number;
  items: SheduleDTO[];
}
