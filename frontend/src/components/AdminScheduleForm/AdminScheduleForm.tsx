import { useState } from 'react';
import { CreateSessionDTO } from '../../utils/api';
import styles from './AdminScheduleForm.module.scss';

type Props = {
  filmId: string;
  onSubmit: (data: CreateSessionDTO) => Promise<void>;
  error?: string | null;
};

export const AdminScheduleForm = ({ filmId, onSubmit, error }: Props) => {
  const [formData, setFormData] = useState<CreateSessionDTO>({
    film: filmId,
    daytime: '',
    hall: '',  day: '',
      time:'',
    rows: 0,
    seats: 0,
    price: 0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'film' ? filmId : 
             ['rows', 'seats', 'price'].includes(name) ? Number(value) : 
             value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    setFormData({
      film: filmId,
      daytime: '',
      day: '',
      time:'',
      hall: '',
      rows: 0,
      seats: 0,
      price: 0
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Добавить сеанс для фильма {formData.film}</h2>
      
      <input type="hidden" name="film" value={formData.film} />

      <div className={styles.formGroup}>
        <label className={styles.label}>
          Дата и время
          <input
            className={styles.input}
            name="daytime"
            type="datetime-local"
            value={formData.daytime}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          Зал
          <input
            className={styles.input}
            name="hall"
            type="text"
            value={formData.hall}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          Ряды
          <input
            className={styles.input}
            name="rows"
            type="number"
            min="1"
            max='5'
            value={formData.rows}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          Места в ряду
          <input
            className={styles.input}
            name="seats"
            type="number"
            min="1"
            max='10'
            value={formData.seats}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          Цена билета
          <input
            className={styles.input}
            name="price"
            type="number"
            min="0"
            step="1"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      
      <button className={styles.submitButton} type="submit">
        Создать сеанс
      </button>
    </form>
  );
};