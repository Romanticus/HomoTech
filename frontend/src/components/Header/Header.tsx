import styles from './Header.module.scss';
import logo from '../../assets/logo.svg';

export type HeaderProps = {
    counter: number;
    onClick: () => void;
};

export function Header({ counter, onClick }: HeaderProps) {
    return (
        <header className={styles.header}>
            <a className={styles.logo} href="/">
                <img
                    className={styles.logoImage}
                    src={logo}
                    alt="Film! logo"
                />
            </a>
            <button className={styles.basket} onClick={onClick}>
                <span className={styles.counter}>{counter}</span>
            </button>
        </header>
    );
}