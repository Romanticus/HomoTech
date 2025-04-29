import React from "react";
import {createPortal} from "react-dom";
import clsx from "clsx";
import styles from './Modal.module.scss';


export type ModalProps = {
    onClose: () => void;
    header: React.ReactNode;
    actions: React.ReactNode;
    children: React.ReactNode;
    message?: string;
    isError?: boolean;
    rootElement?: HTMLElement;
    isPortal?: boolean;
}

export function Modal({
    onClose,
    header,
    actions,
    children,
    message = '',
    isError = false,
    isPortal = true,
    rootElement = document.body
}: ModalProps) {
    const handleClose = (event: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    }

    const modal = <div className={clsx(styles.modal, {
        [styles.active]: true
    })} onClick={handleClose}>
        <div className={styles.container}>
            <button className={styles.close} aria-label="закрыть" onClick={handleClose}></button>
            <div className={styles.header}>{header}</div>
            <div className={styles.content}>{children}</div>
            <div className={styles.footer}>
                {actions}
                <span className={clsx(styles.message, {
                    [styles.error]: isError
                })}>{message}</span>
            </div>
        </div>
    </div>;

    return isPortal ? createPortal(modal, rootElement) : modal;
}