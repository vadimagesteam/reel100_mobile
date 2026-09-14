/**
 * A shared hashtag link must carry the whole intersection: sharing
 * "#oregon + #fishing" has to open both, not whichever half survived the trip.
 */
jest.mock('react-native-config', () => ({ APP_SHARE_URL: 'https://rushranks.test' }));

import { buildTagLink } from './tagLink';

describe('buildTagLink', () => {
  it('keeps every tag in one param', () => {
    expect(buildTagLink(['oregon', 'fishing'])).toBe(
      'https://rushranks.test/tags?tags=oregon%2Cfishing',
    );
  });

  it('handles a single tag', () => {
    expect(buildTagLink(['fishing'])).toBe('https://rushranks.test/tags?tags=fishing');
  });

  it('escapes tags containing spaces', () => {
    expect(buildTagLink(['dirt bike'])).toBe('https://rushranks.test/tags?tags=dirt%20bike');
  });
});
