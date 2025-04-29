import styles from './Basket.module.scss';
import {Ticket, TicketProps} from "../Ticket/Ticket.tsx";

export type BasketItem = Omit<TicketProps, 'className' | 'onDelete'> & { id: string };

export type BasketProps = {
    items: BasketItem[];
    onDelete: (item: string) => void;
}

export function Basket({ items, onDelete }: BasketProps) {
    return (
        <div className={styles.basket}>
            {items.map((item) => <Ticket
                key={item.id}
                place={item.place}
                session={item.session}
                price={item.price}
                onDelete={() => onDelete(item.id)}
            />)}
        </div>
    );
}