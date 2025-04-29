import {HTMLAttributes} from "react";
import clsx from 'clsx';
import styles from './Card.module.scss';

export type CardProps = {
    id: string;
    image: string;
    title: string;
} & HTMLAttributes<HTMLButtonElement>;

export function Card({ id, image, title, className, ...props }: CardProps) {
    return (
        <button data-id={id} {...props} className={clsx(styles.card, className)}>
            <img className={styles.image} src={image} alt={title} />
            <span className={styles.text}>{title}</span>
        </button>
    );
}