import { useState } from 'react';
import { CreateFilmDTO } from '../../utils/api';
import styles from './AdminFilmForm.module.scss';

type Props = {
  onSubmit: (data: CreateFilmDTO) => void;
  error?: string | null;
};

export const AdminFilmForm = ({ onSubmit, error }: Props) => {
  const [formData, setFormData] = useState<CreateFilmDTO>({
    title: '',
    rating: 0,
    director: '',
    tags: [],
    about: '',
    description: '',
    image: '',
    cover: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'rating') {
      setFormData(prev => ({
        ...prev,
        [name]: Math.min(10, Math.max(0, Number(value)))
      }));
    } else if (name === 'tags') {
      setFormData(prev => ({
        ...prev,
        tags: value.split(',').map(tag => tag.trim())
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      title: '',
      rating: 0,
      director: '',
      tags: [],
      about: '',
      description: '',
      image: '',
      cover: ''
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Добавить новый фильм</h2>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          Название фильма
          <input
            className={styles.input}
            name="title"
            type="text"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          Рейтинг (0-10)
          <input
            className={styles.input}
            name="rating"
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={formData.rating}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          Режиссер
          <input
            className={styles.input}
            name="director"
            type="text"
            value={formData.director}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          Теги 
          <input
            className={styles.input}
            name="tags"
            type="text"
            value={formData.tags.join(', ')}
            onChange={handleInputChange}
          />
        </label>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          Краткое описание
          <textarea
            className={styles.textarea}
            name="about"
            value={formData.about}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          Полное описание
          <textarea
            className={styles.textarea}
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          URL изображения
          <input
            className={styles.input}
            name="image"
            type="url"
            value={formData.image}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          URL обложки
          <input
            className={styles.input}
            name="cover"
            type="url"
            value={formData.cover}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      
      <button className={styles.submitButton} type="submit">
        Сохранить фильм
      </button>
    </form>
  );
};