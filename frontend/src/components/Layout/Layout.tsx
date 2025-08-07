import clsx from 'clsx';
import styles from './Layout.module.scss';
import { useEffect } from 'react';
 
import { REACT_APP_ADMIN_TRIGGER_KEY } from '../../utils/constants';

export type LayoutProps = {
    children: React.ReactNode;
    isLocked?: boolean;
    onOpenAdminPanel:()=>void;
};

export function Layout({children, isLocked, onOpenAdminPanel}: LayoutProps) {
    // В Layout.tsx 
    const openAdminPanel= onOpenAdminPanel
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
    
    if (e.ctrlKey && 
        e.shiftKey && 
        e.code === REACT_APP_ADMIN_TRIGGER_KEY) {
 
        openAdminPanel(); // Вызов функции открытия админ-панели
      e.preventDefault(); // Блокировка стандартного поведения
    }
  };

  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, [openAdminPanel]); // Добавляем зависимость
    return (
        <div className={clsx(styles.wrapper, {
            [styles.locked]: isLocked,
        })}>
            {children}
        </div>
    );
}