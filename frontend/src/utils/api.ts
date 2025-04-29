import dayjs from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru-ru');

export enum EnumApiMethods {
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    GET = 'GET',
}

export type ErrorState = {
    error: string;
};


export class Api {
    readonly baseUrl: string;
    protected _options: RequestInit;

    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this._options = {
            headers: {
                'Content-Type': 'application/json',
                ...((options.headers as object) ?? {}),
            },
        };
    }

    protected async _handleResponse<T>(response: Response): Promise<T> {
        if (response.ok) return response.json();
        const data = (await response.json()) as ErrorState;
        return Promise.reject(data.error ?? response.statusText);
    }

    protected async _get<T>(uri: string, method = EnumApiMethods.GET) {
        const response = await fetch(this.baseUrl + uri, {
            ...this._options,
            method,
        });
        return this._handleResponse<T>(response);
    }

    protected async _post<T>(
        uri: string,
        data: object,
        method = EnumApiMethods.POST
    ) {
        const response = await fetch(this.baseUrl + uri, {
            ...this._options,
            method,
            body: JSON.stringify(data),
        });
        return this._handleResponse<T>(response);
    }
}

export type ApiListResponse<Type> = {
    total: number;
    items: Type[];
};

export interface Movie {
    id: string;
    rating: number;
    director: string;
    tags: string[];
    title: string;
    about: string;
    description: string;
    image: string;
    cover: string;
}

export interface Session {
    id: string;
    film: string;
    daytime: string;
    day: string;
    time: string;
    hall: string;
    rows: number;
    seats: number;
    price: number;
    taken: string[];
}

export interface Ticket {
    film: string;
    session: string;
    daytime: string;
    day: string;
    time: string;
    row: number;
    seat: number;
    price: number;
}

export interface Contacts {
    email: string;
    phone: string;
}

export interface Order extends Contacts {
    tickets: Ticket[];
}

export interface OrderResult extends Ticket {
    id: string;
}

export interface IFilmAPI {
    getFilms: () => Promise<Movie[]>;
    getFilmSchedule: (id: string) => Promise<Session[]>;
    orderTickets: (order: Order) => Promise<OrderResult[]>;
}

/**
 * Класс для работы с API фильмов
 */
export class FilmAPI extends Api implements IFilmAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    /**
     * Получить список сеансов фильма
     * @param id
     */
    async getFilmSchedule(id: string): Promise<Session[]> {
        const data = await this._get<ApiListResponse<Session>>(
            `/films/${id}/schedule`
        );
        return data.items.map((schedule) => {
            const daytime = dayjs(schedule.daytime);
            return {
                ...schedule,
                film: id,
                day: daytime.format('D MMMM'),
                time: daytime.format('HH:mm'),
            };
        });
    }

    /**
     * Получить список фильмов
     */
    async getFilms(): Promise<Movie[]> {
        const data = await this._get<ApiListResponse<Movie>>('/films');
        return data.items.map((item) => ({
            ...item,
            image: this.cdn + item.image,
            cover: this.cdn + item.cover,
        }));
    }

    /**
     * Забронировать билеты
     * @param order - данные для бронирования
     * @param order.tickets - список билетов, для каждого требуются как минимум поля film, session, row, seat
     * @param order.email - email пользователя
     * @param order.phone - телефон пользователя
     */
    async orderTickets(order: Order): Promise<OrderResult[]> {
        const data = await this._post<ApiListResponse<OrderResult>>(
            '/order',
            order
        );
        return data.items.map((ticket) => {
            const daytime = dayjs(ticket.daytime);
            return {
                ...ticket,
                day: daytime.format('D MMMM'),
                time: daytime.format('HH:mm'),
            };
        });
    }
}
