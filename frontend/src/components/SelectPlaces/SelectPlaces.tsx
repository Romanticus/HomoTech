import styles from './SelectPlaces.module.scss';
import clsx from "clsx";

export type SelectedPlace = {
    row: number;
    seat: number;
};

export type HallSize = {
    rows: number;
    seats: number;
};

export type SelectPlacesProps = {
    hall: HallSize;
    taken: string[];
    selected: SelectedPlace[];
    onSelect: (selected: string) => void;
};

const getSeatKey = (row: number, seat: number) => {
    return [row, seat].join(':');
}

const createArray = (length: number, shift: number = 0): number[] => {
    return Array.from({ length }, (_, i) => i + shift);
}

export function SelectPlaces({ hall, taken, selected, onSelect }: SelectPlacesProps) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const target = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;
        const row = Number(target.dataset.row);
        const seat = Number(target.dataset.seat);
        if (row && seat) {
            onSelect(getSeatKey(row, seat));
        }
    }

    const selectedSeats = new Set(
        selected.map((place) => getSeatKey(place.row, place.seat))
    );

    return (
        <form className={styles.places} name="places" onSubmit={handleSubmit}>
            <div className={styles.screen}>ЭКРАН</div>
            {createArray(hall.rows, 1).map(row => <div
                key={row}
                className={styles.row}
            >
                <div className={styles.label}>Ряд {row}</div>
                <div className={styles.seats}>
                    {createArray(hall.seats, 1).map(seat => {
                        const seatKey = getSeatKey(row, seat);
                        return (<button
                            key={seatKey}
                            className={clsx(styles.seat, {
                                [styles.seat_active]: selectedSeats.has(seatKey),
                            })}
                            data-row={row}
                            data-seat={seat}
                            disabled={taken.includes(seatKey)}
                        >
                            {seat}
                        </button>)
                    })}
                </div>
            </div>)}
        </form>
    );
}