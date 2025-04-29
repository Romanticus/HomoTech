import clsx from 'clsx';
import styles from './Layout.module.scss';

export type LayoutProps = {
    children: React.ReactNode;
    isLocked?: boolean;
};

export function Layout({children, isLocked}: LayoutProps) {
    return (
        <div className={clsx(styles.wrapper, {
            [styles.locked]: isLocked,
        })}>
            {children}
        </div>
    );
}