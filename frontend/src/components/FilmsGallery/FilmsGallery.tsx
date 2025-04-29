import styles from './FilmsGallery.module.scss';
import {Card, CardProps} from "../Card/Card.tsx";
import clsx from "clsx";

export type FilmsGalleryProps = {
    onClick?: (id: string) => void;
    items: CardProps[];
    selected?: string | null;
}

export function FilmsGallery({items, selected = null, onClick}: FilmsGalleryProps) {
    return (
        <footer className={styles.gallery}>
            {items.map((item) => (
                <Card
                    key={item.id}
                    {...item}
                    className={clsx(styles.item, {
                        [styles.item_active]: item.id === selected
                    })}
                    onClick={() => {
                        onClick?.(item.id);
                    }}
                />
            ))}
        </footer>
    );
}