import { useState } from "react";
 
import { CreateFilmDTO, CreateSessionDTO } from "../../utils/api";
import { AdminFilmForm } from "../AdminFilmForm/AdminFilmForm";
import { AdminScheduleForm } from "../AdminScheduleForm/AdminScheduleForm";
import { useAppContext } from "../../contexts/AppContext";
import styles from './AdminPanel.module.scss';
export default function AdminPanel() {
  const { state,  handlers } = useAppContext();
  const [selectedFilmId, setSelectedFilmId] = useState('');

  return (
    
    <div className={styles.adminPanel}>
      <button className={styles.submitButton} onClick={handlers.handleAdminLogout}>Выйти</button>
      { state.adminIsAuthenticated && (<>
      <div className="admin-section">
    
        <AdminFilmForm 
          onSubmit={handlers.handleCreateFilm}
          error={state.adminError}
        />ё
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
        )}
      </div></>)}
    </div> 
  );
};