import styles from './Message.module.scss';
import {Button} from "../Button/Button.tsx";
import successIcon from '../../assets/check-circle.svg';

export type MessageProps = {
    title: string;
    description: string;
    action: string;
    icon?: string;
    onClick: () => void;
};

export function Message({ title, description, action, icon, onClick}: MessageProps) {
    return (
        <div className={styles.success}>
            <div className={styles.message}>
                <img src={icon ?? successIcon} alt={title} />
                <h2 className={styles.title}>{title}</h2>
                <p className={styles.description}>{description}</p>
                <Button label={action} className={styles.close} onClick={onClick} />
            </div>
        </div>
    );
}