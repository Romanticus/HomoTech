import { useEffect } from 'react';
import styles from './AdminOrdersList.module.scss';
import { useAppContext } from '../../contexts/AppContext';

export const AdminOrdersList = () => {
  const { state, handlers } = useAppContext();
  
  useEffect(() => {
    
      handlers.handleGetOrders();
     
    
  }, [state.adminIsAuthenticated]);

  const getFilmTitle = (filmId: string) => 
    state.films.find(f => f.id === filmId)?.title || 'Неизвестный фильм';

  return (
    <div className={styles.ordersSection}>
      <h2>Список заказов</h2>
      <div className={styles.ordersTable}>
        {state.orders && state.orders.map(order => (
          <div key={order.id} className={styles.orderCard}>

            <div className={styles.orderHeader}>
              <span>Заказ #{order.id.slice(0,8)}</span>
              <span>{new Date(order.created_at).toLocaleDateString('ru-RU')}</span>
              <span>{order.total} ₽</span>
            </div>

            <div className={styles.orderDetails}>
              <div className={styles.userInfo}>
                <p>Клиент: {order.email}</p>
                <p>Телефон: {order.phone}</p>
              </div>

              <details key={order.id} className={styles.ticketsList}>
               <summary ><h4>Билеты: ▼ </h4></summary>
                {order.tickets.map(ticket => (
                  <div key={ticket.id} className={styles.ticketItem}>
                    <div className={styles.ticketFilm}>
                      <span className={styles.label}>Фильм:</span>
                      <span>{getFilmTitle(ticket.film_id)}</span>
                    </div>
                    <div className={styles.ticketSession}>
                      <span className={styles.label}>Сеанс:</span>
                      <span>{new Date(ticket.session_time).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <div className={styles.ticketPlace}>
                      <span className={styles.label}>Место:</span>
                      <span>Ряд {ticket.row}, Место {ticket.seat}</span>
                    </div>
                    <div className={styles.ticketPrice}>
                      <span className={styles.label}>Цена:</span>
                      <span>{ticket.price} ₽</span>
                    </div>
                  </div>
                ))}
              </details>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};