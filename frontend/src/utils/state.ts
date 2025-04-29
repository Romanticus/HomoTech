import {Contacts, Movie, Session, Ticket} from "./api.ts";

export type Modals = 'schedule' | 'places' | 'basket' | 'contacts' | 'success';

export interface AppState {
    films: Movie[];
    selectedFilm: string | null;
    schedule: Session[];
    selectedSession: string | null;
    basket: Ticket[];
    contacts: Contacts;
    modal: Modals | null;
    message: string;
    isError: boolean;
}

export type Actions =
    | { type: 'setFilms', payload: Movie[] }
    | { type: 'selectFilm', payload: string }
    | { type: 'setSchedule', payload: Session[] }
    | { type: 'selectSession', payload: string }
    | { type: 'addToBasket', payload: string }
    | { type: 'removeFromBasket', payload: string }
    | { type: 'setContacts', payload: Contacts }
    | { type: 'openModal', payload: Modals }
    | { type: 'closeModal' }
    | { type: 'clearBasket' };

export const initialState: AppState = {
    films: [],
    selectedFilm: null,
    schedule: [],
    selectedSession: null,
    basket: [],
    contacts: {
        email: '',
        phone: ''
    },
    modal: null,
    message: '',
    isError: false
};

const addTicket = (state: AppState, key: string): AppState => {
    const [row, seat] = key.split(':').map(Number);
    const isExists = state.basket.some(ticket => ticket.row === row && ticket.seat === seat);
    const session = state.schedule.find(session => session.id === state.selectedSession);
    if (session) {
        if (!isExists) {
            const ticket = {
                film: state.selectedFilm!,
                session: state.selectedSession!,
                daytime: session.daytime,
                day: session.day,
                time: session.time,
                row,
                seat,
                price: session.price
            };
            return {
                ...state,
                basket: [...state.basket, ticket]
            };
        } else {
            return {
                ...state,
                basket: state.basket.filter(ticket => ticket.row !== row || ticket.seat !== seat)
            };
        }
    }

    return state;
}

const removeTicket = (state: AppState, key: string): AppState => {
    const [row, seat] = key.split(':').map(Number);
    return {
        ...state,
        basket: state.basket.filter(ticket => ticket.row !== row || ticket.seat !== seat)
    };
}

const validateOrder = (state: AppState): AppState => {
    const errors = [];
    //validate email with regexp
    if (state.contacts.email && !/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(state.contacts.email)) {
        errors.push('Некорректный email');
    }
    //validate phone with regexp
    if (state.contacts.phone && !/\+7\d{10}/.test(state.contacts.phone)) {
        errors.push('Некорректный телефон');
    }

    if (errors.length === 0) {
        return {
            ...state,
            message: '',
            isError: false
        };
    } else {
        return {
            ...state,
            message: errors.join('; '),
            isError: true
        };
    }
}

export function appReducer(state: AppState, action: Actions): AppState {
    switch (action.type) {
        case 'setFilms':
            return {
                ...state,
                films: action.payload,
                selectedFilm: action.payload[0].id
            };
        case 'selectFilm':
            return {
                ...state,
                selectedFilm: action.payload
            };
        case 'setSchedule':
            return {
                ...state,
                schedule: action.payload,
                modal: 'schedule'
            };
        case 'selectSession':
            return {
                ...state,
                selectedSession: action.payload
            };
        case 'addToBasket': return addTicket(state, action.payload);
        case 'removeFromBasket': return removeTicket(state, action.payload);
        case 'setContacts':
            return validateOrder({
                ...state,
                contacts: action.payload
            });
        case 'openModal':
            return {
                ...state,
                modal: action.payload
            };
        case 'closeModal':
            return {
                ...state,
                modal: null
            };
        case 'clearBasket':
            return {
                ...state,
                selectedSession: null,
                basket: []
            };
    }
    return state;
}