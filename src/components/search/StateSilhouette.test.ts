/**
 * statePaths.ts is generated. A regenerate that silently dropped states would
 * degrade those rows to an abbreviation in a circle without failing anything,
 * so the coverage is pinned here.
 */
import { STATE_PATHS } from '../../assets/states/statePaths';
import { resolveStateCode } from './StateSilhouette';

const STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY',
];

describe('state silhouettes', () => {
  it('covers every state, plus DC', () => {
    const missing = [...STATES, 'DC'].filter((code) => !STATE_PATHS[code]);
    expect(missing).toEqual([]);
  });

  it('gives every entry a path and a square viewBox', () => {
    for (const [code, entry] of Object.entries(STATE_PATHS)) {
      expect(entry.d.length).toBeGreaterThan(0);
      const [, , w, h] = entry.viewBox.split(' ').map(Number);
      // Square, so a silhouette drops into a circular avatar without
      // letterboxing or a per-state nudge.
      expect(w).toBeCloseTo(h, 5);
      expect(entry.name.length).toBeGreaterThan(0);
      expect(code).toMatch(/^[A-Z]{2}$/);
    }
  });

  it('resolves a state from its code, its name, or either casing', () => {
    // Search rows carry the backend slug ("OR"); a shared link may carry a name.
    expect(resolveStateCode('OR')).toBe('OR');
    expect(resolveStateCode('or')).toBe('OR');
    expect(resolveStateCode('Oregon')).toBe('OR');
    expect(resolveStateCode('  oregon  ')).toBe('OR');
  });

  it('resolves nothing for a slug that is not a state', () => {
    expect(resolveStateCode('fishing')).toBeUndefined();
    expect(resolveStateCode('')).toBeUndefined();
    expect(resolveStateCode(undefined)).toBeUndefined();
  });
});
