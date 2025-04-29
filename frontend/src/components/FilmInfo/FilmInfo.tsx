import clsx from 'clsx';
import styles from './FilmInfo.module.scss';

export type FilmInfoProps = {
    id: string;
    rating: string | number;
    director: string;
    tags: string[];
    title: string;
    description: string;
    isCompact?: boolean;
};

export function FilmInfo({ id, rating, director, tags, title, description, isCompact = false}: FilmInfoProps) {
    return (
        <article data-id={id} className={clsx(styles.film, {
            [styles.compact]: isCompact,
        })}>
            <div className={styles.about}>
                <span className={styles.rating}>{rating}</span>
                <span className={styles.director}>{director}</span>
                <span className={styles.tags}>{tags}</span>
            </div>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.description}>{description}</p>
        </article>
    );
}