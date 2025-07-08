import { create } from 'zustand';

type CountdownStore = {
  secondsLeft: number;
  update: () => void;
  cleanup: () => void;
  start: () => void;
};

const getCentralTime = () => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const parts = formatter.formatToParts(new Date());

  const get = (type: string) => parts.find((p) => p.type === type)?.value || '00';

  const year = get('year');
  const month = get('month');
  const day = get('day');
  const hour = get('hour');
  const minute = get('minute');
  const second = get('second');

  return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
};

export const useCentralTimeCountdown = create<CountdownStore>((set) => {
  const update = () => {
    const centralNow = getCentralTime();

    const endOfDay = new Date(centralNow);
    endOfDay.setHours(23, 59, 59, 999);

    const diffMs = endOfDay.getTime() - centralNow.getTime();
    const secondsLeft = Math.floor(diffMs / 1000);

    set({ secondsLeft });
  };

  update();
  let interval: number | undefined;

  const start = () => {
    interval = setInterval(update, 1000) as unknown as number;
  };

  return {
    secondsLeft: 0,
    update,
    start,
    cleanup: () => {
      clearInterval(interval);
    },
  };
});
