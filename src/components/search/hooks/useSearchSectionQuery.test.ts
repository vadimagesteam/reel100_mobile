/**
 * Paging "View all" stops on the section's own hasMore. A short page is not
 * the end of a list — treating it as one would cut a section off early — and
 * ignoring hasMore would fetch a wasted empty page at the end of every section.
 */
jest.mock('../../../lib/api', () => ({ api: { get: jest.fn() } }));

import { nextSectionPageParam } from './useSearchSectionQuery';

const page = (hasMore: boolean, count: number) => ({
  hasMore,
  items: Array.from({ length: count }, (_, i) => ({ id: String(i) })) as any,
});

describe('nextSectionPageParam', () => {
  it('asks for the next page from where the loaded rows end', () => {
    expect(nextSectionPageParam(page(true, 20), [page(true, 20)])).toBe(20);
    expect(nextSectionPageParam(page(true, 20), [page(true, 20), page(true, 20)])).toBe(40);
  });

  it('stops when the section says there is no more', () => {
    expect(nextSectionPageParam(page(false, 20), [page(false, 20)])).toBeUndefined();
  });

  it('keeps paging on a short page that still reports more', () => {
    expect(nextSectionPageParam(page(true, 3), [page(true, 3)])).toBe(3);
  });

  it('counts every loaded page, not just the last', () => {
    const pages = [page(true, 20), page(true, 20), page(true, 7)];
    expect(nextSectionPageParam(page(true, 7), pages)).toBe(47);
  });
});
