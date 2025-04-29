import styles from './ModalHeader.module.scss';


export type ModalHeaderProps = {
    title: string;
    description: string;
    onClick: () => void;
};

export function ModalHeader({ title, description, onClick}: ModalHeaderProps) {
    return (
        <div className={styles.header}>
            <div className={styles.actions}>
                <button className={styles.back} onClick={onClick}>Назад</button>
            </div>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.description}>{description}</p>
        </div>
    );
}