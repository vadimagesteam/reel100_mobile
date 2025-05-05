export const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? `0${secs}` : secs}`;
};

export const formatTwoTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) { return '0'; }

    if (seconds < 60) { return `${Math.floor(seconds)}`; }

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getSecondsLeftInDay = () => {
    const now = new Date();
    const secondsPassed = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    return 86400 - secondsPassed;
};

export const formatClockTime = (totalSeconds: number) => {
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
};
