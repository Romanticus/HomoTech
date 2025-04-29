import styles from './SelectSession.module.scss';
import clsx from "clsx";

export type ScheduleSession = {
    id: string;
    day: string;
    time: string;
};

export type DaySchedule = {
    [key: string]: ScheduleSession;
};

export type HallSessions = {
    [key: string]: DaySchedule;
};

export type SelectSessionProps = {
    sessions: ScheduleSession[];
    selected: string | null;
    onSelect: (session: string) => void;
};

function groupSessions(data: ScheduleSession[]) {
    return data.reduce<HallSessions>((a, c) => {
        if (!a[c.day]) a[c.day] = {};
        a[c.day][c.time] = c;
        return a;
    }, {});
}

function dayTimeKey(day: string, time: string) {
    return [day, time].join(':');
}

export function SelectSession({ sessions, selected = null, onSelect }: SelectSessionProps) {
    const data = groupSessions(sessions);
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const target = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;
        const id = String(target.dataset.id);
        const day = String(target.dataset.day);
        const time = String(target.dataset.time);
        if (id && day && time) {
            onSelect(id);
        }
    }

    return (
        <form className={styles.schedule} name="schedule" onSubmit={handleSubmit}>
            {Object.keys(data).map((day) => <div key={day} className={styles.day}>
                <div className={styles.label}>{day}</div>
                {Object.keys(data[day]).map(time => <button
                    key={dayTimeKey(day, time)}
                    className={clsx(styles.time, {
                        [styles.place_active]: selected === data[day][time].id
                    })}
                    data-id={data[day][time].id}
                    data-day={day}
                    data-time={time}
                >
                    {time}
                </button>)}
            </div>)}
        </form>
    );
}