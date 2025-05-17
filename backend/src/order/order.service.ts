// order.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import { uuid } from 'uuidv4';
import { ConfigService } from '@nestjs/config';
import { CreateOrderDto, OrderResponse } from './dto/order.dto';
import * as nodemailer from 'nodemailer';
import * as dayjs from 'dayjs';
import { error, log } from 'console';
 
@Injectable()
export class OrderService {
  constructor(
    private readonly filmsRepository: FilmsRepository,
    private readonly configService: ConfigService,
  ) {}
  public async renderEmailTemplate(dto: CreateOrderDto): Promise<string> {
    const total = dto.tickets.reduce((sum, ticket) => sum + ticket.price, 0);
     const ticketsWithFilms = await Promise.all(
        dto.tickets.map(async (ticket) => ({
            ...ticket,
            filmTitle: await this.findFilmName(ticket.film)
        }))
    );
    console.log('Зарендерили');
    return `
  <html>
<body style="margin:0; padding:20px; background:#f7f7f7; font-family:Arial,sans-serif;">
    <table style="padding:20px;" width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center">
                <!-- Контейнер -->
                <table width="600" cellpadding="30" cellspacing="0" style="background:#fff; border-radius:10px;">
                    <!-- Заголовок -->
                    <tr>
                        <td style="border-bottom:2px solid #eee; padding-bottom:20px; text-align:center;">
                            <h1 style="color:#2c3e50; margin:0;">🎬 Ваш заказ в HomoTech</h1>
                            <p style="margin:10px 0 0;">Спасибо за покупку! Ваши билеты готовы</p>
                        </td>
                    </tr>

                    <!-- Данные пользователя -->
                    <tr>
                        <td style="padding:20px 0;">
                            <p style="margin:0 0 10px;"><strong>📧 Email:</strong> ${dto.email}</p>
                            <p style="margin:0;"><strong>📱 Телефон: </strong> ${dto.phone}</p>
                        </td>
                    </tr>

                    <!-- Таблица билетов -->
                    <tr>
                        <td>
                            <table width="100%" cellpadding="12" cellspacing="0" style="border-collapse:collapse;">
                                <thead>
                                    <tr style="background:#f8f9fa;">
                                        <th align="left" style="padding:12px; border-bottom:1px solid #eee;">Фильм</th>
                                        <th align="left" style="padding:12px; border-bottom:1px solid #eee;">Дата и время</th>
                                        <th align="left" style="padding:12px; border-bottom:1px solid #eee;">Ряд</th>
                                        <th align="left" style="padding:12px; border-bottom:1px solid #eee;">Место</th>
                                        <th align="left" style="padding:12px; border-bottom:1px solid #eee;">Цена</th>
                                    </tr>
                                </thead>
                                <tbody>
                                       ${ticketsWithFilms
                                         .map(
                                           (ticket) => `
                                          <tr>
                                            <td>${ticket.filmTitle }</td>
                                            <td>${dayjs(ticket.daytime).format('DD.MM.YYYY HH:mm')}</td>
                                            <td>${ticket.row}</td>
                                            <td>${ticket.seat}</td>
                                            <td>${ticket.price} ₽</td>
                                          </tr>
                                        `,
                                         )
                                         .join('')}
  
                                </tbody>
                            </table>
                        </td>
                    </tr>

                    <!-- Итого -->
                    <tr>
                        <td>
                            <p style="margin:20px 0 0; text-align:right; font-size:18px; color:#27ae60;">
                                Итого: ${total} ₽
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    
    
  `;
  }
public async findFilmName(id: string): Promise<string> {
    const film = await this.filmsRepository.findFilm(id);
    console.log(film.title);
    
    return film.title;
}
  async createOrder(dto: CreateOrderDto): Promise<OrderResponse> {
    const { email, tickets } = dto;
    if (!tickets?.length) {
      throw new BadRequestException('Минимум один билет требуется для заказа');
    }

    const firstTicket = tickets[0];

    try {
       const  rendered = await this.renderEmailTemplate(dto);
      const cfg = {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
        from: this.configService.get<string>('MAIL_FROM'),
      };

      // 1. Сначала создаем транспортер
      const transporter = nodemailer.createTransport({
        service: 'yandex',
        host: "smtp.yandex.ru",
        secure: true,
    port: 465,
        auth: {
          user: cfg.user,
          pass: cfg.pass,
        },
      });
      console.log(transporter);
      // 2. Затем резервируем места и отправляем письмо
      await this.filmsRepository.reserveSeats(
        firstTicket.film,
        firstTicket.session,
        tickets,
      );

      // 3. Отправка письма после успешного резервирования
      await transporter.sendMail(
        {
          from: cfg.from, // Используем MAIL_FROM вместо MAIL_USER
          to: email,
          subject: 'Ваш заказ билетов!',
          html:  rendered,
        },
        (err, info) => {
          if (err) {
            console.log(err);
          }
          if (info){
            console.log(info)
          }
        },
      );

      return {
        total: tickets.length,
        items: tickets.map((ticket) => ({
          ...ticket,
          id: uuid(),
        })),
      };
    } catch (error) {
      console.error('Ошибка при создании заказа:', error);
      throw new BadRequestException(
        error.message || 'Произошла ошибка при создании заказа',
      );
    }
  }
}
