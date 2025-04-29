import styles from './FilmPreview.module.scss';
import {FilmInfo, FilmInfoProps} from "../FilmInfo/FilmInfo.tsx";
import {Button} from "../Button/Button.tsx";

export type FilmPreviewProps = FilmInfoProps & {
    cover: string;
    onClick?: () => void;
};

export function FilmPreview({onClick, cover, ...props}: FilmPreviewProps) {
    return (
        <main className={styles.hero}>
            <img src={cover} alt={props.title} className={styles.background}/>
            <div className={styles.content}>
                <FilmInfo {...props} />
                <Button
                    label="Купить билет"
                    className={styles.action}
                    onClick={onClick}
                />
            </div>
        </main>
    );
}