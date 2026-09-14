/**
 * What to call a video on screen.
 *
 * A video's `label` is its title, but nothing ever asks the author for one:
 * the posting screen collects a caption and tags, and publishing falls back to
 * the recording's file name. That name is whatever the camera produced — a
 * UUID on iOS, a `VID_20260830_141233` on Android — so search results read as
 * a list of codes.
 *
 * `captionTitle` fixes it going forward, by titling new uploads from their
 * caption. `videoDisplayTitle` covers everything already posted, by preferring
 * the caption and refusing to print a label that is plainly a file name.
 */

/** Longest title taken from a caption; the rest stays in the caption itself. */
export const TITLE_MAX_LENGTH = 80;

/**
 * The first line of a caption, condensed into a title. Empty when the caption
 * has nothing a title can be made of (blank, or only emoji/punctuation) —
 * the caller then keeps whatever fallback it had.
 */
export const captionTitle = (caption: string | null | undefined): string => {
  const firstLine = (caption ?? '').split('\n')[0].trim().replace(/\s+/g, ' ');
  if (!/[\p{L}\p{N}]/u.test(firstLine)) {
    return '';
  }
  if (firstLine.length <= TITLE_MAX_LENGTH) {
    return firstLine;
  }
  // Cut on a word boundary where there is one close to the limit, so the title
  // doesn't end mid-word.
  const cut = firstLine.slice(0, TITLE_MAX_LENGTH);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > TITLE_MAX_LENGTH * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
};

/**
 * Whether a label is a recording's file name rather than something a person
 * wrote. Anything with a space is treated as authored — a real title is far
 * more likely to contain one than a file name is.
 */
export const isGeneratedLabel = (label: string): boolean => {
  const value = label.trim();
  if (!value || /\s/.test(value)) {
    return false;
  }
  return (
    // 8-4-4-4-12 UUID, with or without the dashes (iOS temp recordings).
    /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i.test(value) ||
    // A long unbroken hex/base-ish run, e.g. "a3f9c1d0e5b7".
    /^[0-9a-f]{16,}$/i.test(value) ||
    // Camera and editor conventions: VID_20260830_141233, IMG-0042, trim.A1B2.
    /^(vid|img|mov|dsc|trim|video|rec)[-_.]/i.test(value) ||
    // Any run of 8+ digits is a timestamp or counter, never a title.
    /\d{8,}/.test(value)
  );
};

/**
 * The name to show for a video: its caption, else an authored label, else who
 * made it. Never a file name.
 */
export const videoDisplayTitle = (video: {
  label: string;
  description?: string | null;
  user?: { name?: string | null } | null;
}): string => {
  const fromCaption = captionTitle(video.description);
  if (fromCaption) {
    return fromCaption;
  }
  if (video.label && !isGeneratedLabel(video.label)) {
    return video.label;
  }
  const author = video.user?.name?.trim();
  return author ? `Video by ${author}` : 'Untitled video';
};
