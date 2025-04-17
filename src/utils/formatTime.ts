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
