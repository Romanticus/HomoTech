import {ButtonHTMLAttributes} from "react";
import clsx from "clsx";
import styles from './Button.module.scss';

export type ButtonProps = {
    label: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ label, className, ...props }: ButtonProps) {
  return (
    <button {...props} className={clsx(styles.button, className)}>
        {label}
    </button>
  )
}