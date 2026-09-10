import {
  captionTitle,
  isGeneratedLabel,
  TITLE_MAX_LENGTH,
  videoDisplayTitle,
} from './videoTitle';

describe('captionTitle', () => {
  it('takes the first line and collapses whitespace', () => {
    expect(captionTitle('  Big   wave  \nsecond line')).toBe('Big wave');
  });

  it('is empty when there is nothing to name the video after', () => {
    expect(captionTitle('')).toBe('');
    expect(captionTitle(null)).toBe('');
    expect(captionTitle('   \n  ')).toBe('');
    expect(captionTitle('🔥🔥🔥')).toBe('');
  });

  it('truncates a long caption on a word boundary', () => {
    const long = 'word '.repeat(40).trim();
    const title = captionTitle(long);
    expect(title.length).toBeLessThanOrEqual(TITLE_MAX_LENGTH + 1);
    expect(title.endsWith('…')).toBe(true);
    expect(title).not.toMatch(/wor…$/);
  });
});

describe('isGeneratedLabel', () => {
  it('recognises what the recorders produce', () => {
    expect(isGeneratedLabel('E7B41C2A-9F30-4A11-8C7D-2B5E6F0A1D93')).toBe(true);
    expect(isGeneratedLabel('a3f9c1d0e5b74821')).toBe(true);
    expect(isGeneratedLabel('VID_20260830_141233')).toBe(true);
    expect(isGeneratedLabel('trim.A1B2C3')).toBe(true);
  });

  it('leaves an authored title alone', () => {
    expect(isGeneratedLabel('Sunset at Cannon Beach')).toBe(false);
    expect(isGeneratedLabel('Basketball')).toBe(false);
    // A title with digits is still a title.
    expect(isGeneratedLabel('Top10')).toBe(false);
  });
});

describe('videoDisplayTitle', () => {
  const user = { name: 'Jordan Reed' };

  it('prefers the caption', () => {
    expect(
      videoDisplayTitle({ label: 'VID_20260830_141233', description: 'Dunk of the year', user }),
    ).toBe('Dunk of the year');
  });

  it('keeps a label a person wrote', () => {
    expect(videoDisplayTitle({ label: 'Cannon Beach', description: null, user })).toBe(
      'Cannon Beach',
    );
  });

  it('names the author rather than printing a file name', () => {
    expect(
      videoDisplayTitle({
        label: 'E7B41C2A-9F30-4A11-8C7D-2B5E6F0A1D93',
        description: null,
        user,
      }),
    ).toBe('Video by Jordan Reed');
  });

  it('falls back once more when there is no author either', () => {
    expect(videoDisplayTitle({ label: 'a3f9c1d0e5b74821', description: '', user: null })).toBe(
      'Untitled video',
    );
  });
});
