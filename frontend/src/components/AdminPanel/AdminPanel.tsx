import { useState } from "react";
 
 
import { AdminFilmForm } from "../AdminFilmForm/AdminFilmForm";
import { AdminScheduleForm } from "../AdminScheduleForm/AdminScheduleForm";
import { useAppContext } from "../../contexts/AppContext";
import styles from './AdminPanel.module.scss';
import { AdminOrdersList } from "../AdminOrdersList/AdminOrdersList";
 
export default function AdminPanel() {
  const { state,  handlers } = useAppContext();
  const [selectedFilmId, setSelectedFilmId] = useState('');
  const [showOrders, setShowOrders] = useState(false);

  return (
    
    <div className={styles.adminPanel}>
      <button className={styles.submitButton} onClick={handlers.handleAdminLogout}>Выйти</button>
     
      <button className={styles.customButton} onClick={() => setShowOrders(!showOrders)}>{showOrders ? 'Скрыть заказы' : 'Просмотр заказов'}</button>
      { state.adminIsAuthenticated&& (
           (<>
      {showOrders && (<AdminOrdersList/>)} 
      <div className="admin-section">
    
        <AdminFilmForm 
          onSubmit={handlers.handleCreateFilm}
          error={state.adminError}
        /> 
      </div>

      <div className={styles.adminSection}>
        <h2>Добавить сеанс</h2>
        <select
          value={selectedFilmId}
          onChange={(e) => setSelectedFilmId(e.target.value)}
        >
          <option value="">Выберите фильм</option>
          {state.films.map(film => (
            <option key={film.id} value={film.id}>
              {film.title}
            </option>
          ))}
        </select>
        
        {selectedFilmId && (
          <AdminScheduleForm
            filmId={selectedFilmId}
            onSubmit={handlers.handleCreateSchedule}
            error={state.adminError}
          />
        )}  </div></>))}
    </div> 
  );
}