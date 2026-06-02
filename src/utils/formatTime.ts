export const formatSeconds = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60); // лише для UI
  return `${mins}:${secs < 10 ? `0${secs}` : secs}`;
};

export const formatTwoTime = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) {
    return '0';
  }

  if (seconds < 60) {
    return `${Math.floor(seconds)}`;
  }

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

export const formatDateTime = () => {};

export const formatTimeAgo = (date: string): string => {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 45) {
    return 'a few seconds ago';
  }

  if (diffInSeconds < 90) {
    return 'a minute ago';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return diffInMinutes === 1 ? 'a minute ago' : `${diffInMinutes} minutes ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return 'yesterday';
  }
  if (diffInDays < 30) {
    return `${diffInDays} days ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return diffInMonths === 1 ? 'a month ago' : `${diffInMonths} months ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return diffInYears === 1 ? 'a year ago' : `${diffInYears} years ago`;
};

/**
 * Compact relative time for video timestamps: `32m ago`, `12h ago`, `5d ago`.
 * Used by the feed overlay; for older videos prefer {@link formatVideoTimestamp}.
 */
export const formatTimeAgoShort = (date: string | Date): string => {
  const then = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((Date.now() - then.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

/**
 * Timestamp shown at the bottom-right of a video: relative time (`12h ago`,
 * `32m ago`) for recent videos, and the absolute short date (`5/24/26`) once
 * the video is older than 30 days.
 */
export function formatVideoTimestamp(isoDateTime: string | Date | null | undefined): string {
  if (!isoDateTime) return '';
  const date = typeof isoDateTime === 'string' ? new Date(isoDateTime) : isoDateTime;
  if (isNaN(date.getTime())) return '';
  const diffMs = Date.now() - date.getTime();
  if (diffMs < 0) return 'just now'; // future timestamp (clock skew) — clamp
  const diffInDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffInDays >= 30 ? formatShortDate(date) : formatTimeAgoShort(date);
}

export const { locale } = Intl.NumberFormat().resolvedOptions();

export function isoUTCDateToLocate(isoDateTime: string | Date): string {
  const date = typeof isoDateTime === 'string' ? new Date(isoDateTime) : isoDateTime;
  return date.toLocaleDateString(locale, { timeZone: 'UTC' });
}

export function formatShortDate(isoDateTime: string | Date | null | undefined): string {
  if (!isoDateTime) return '';
  const date = typeof isoDateTime === 'string' ? new Date(isoDateTime) : isoDateTime;
  if (isNaN(date.getTime())) return '';
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = String(date.getFullYear()).slice(-2);
  return `${month}/${day}/${year}`;
}

export function isoDateTimeToLocale(isoDateTime: string | Date): string {
  const date = typeof isoDateTime === 'string' ? new Date(isoDateTime) : isoDateTime;
  return `${date.toLocaleDateString()}, ${date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  })}`;
}

export const formatTime = (isoDateTime: string | Date) => {
  const date = typeof isoDateTime === 'string' ? new Date(isoDateTime) : isoDateTime;
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
