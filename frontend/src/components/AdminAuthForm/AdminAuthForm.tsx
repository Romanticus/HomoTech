import React, { useState } from "react";
import styles from '../ContactsForm/ContactsForm.module.scss';

export type AdminAuthFormProps = {
    onSubmit: (password: string) => void;
    error?: string | null;
};

export function AdminAuthForm({ onSubmit, error }: AdminAuthFormProps) {
    const [password, setPassword] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit(password);
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.label}>
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                    name="password"
                    type="password"
                    placeholder="Админский пароль"
                    autoComplete="current-password"
                    required
                    autoFocus
                />
            </label>
            
            {error && <div className={styles.error}>{error}</div>}

            <button 
                type="submit" 
                className={styles.submitButton}
            >
                Войти
            </button>
        </form>
    );
}