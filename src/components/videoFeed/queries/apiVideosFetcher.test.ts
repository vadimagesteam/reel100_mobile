/**
 * The videos fetcher serves two different endpoints. A tag filter cannot be
 * expressed through the GraphQL VideoWhereInput at all, so tag requests are
 * routed to the tags endpoint instead — and routing them through this same
 * fetcher is what lets the hashtag page reuse the existing grid and video-feed
 * modal rather than fork parallel copies of both.
 */
const mockGet = jest.fn();
const mockPost = jest.fn();

jest.mock('../../../lib/api', () => ({
  api: { get: (...a: any[]) => mockGet(...a), post: (...a: any[]) => mockPost(...a) },
}));

import { apiVideosFetcher } from './apiVideosFetcher';

describe('apiVideosFetcher', () => {
  beforeEach(() => {
    mockGet.mockReset().mockResolvedValue({ data: { videos: [{ id: 'v1' }] } });
    mockPost.mockReset().mockResolvedValue({ data: { data: { videos: [{ id: 'g1' }] } } });
  });

  it('goes to graphql when no tags are given', async () => {
    const result = await apiVideosFetcher({ take: 10, skip: 0 });
    expect(mockPost).toHaveBeenCalledWith('/graphql', expect.anything());
    expect(mockGet).not.toHaveBeenCalled();
    expect(result).toEqual([{ id: 'g1' }]);
  });

  it('goes to the tags endpoint when tags are given', async () => {
    const result = await apiVideosFetcher({ take: 10, skip: 20, tags: ['oregon', 'fishing'] });
    expect(mockPost).not.toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('/api/tags/videos', {
      params: { tags: 'oregon,fishing', sort: 'top', skip: 20, take: 10 },
    });
    expect(result).toEqual([{ id: 'v1' }]);
  });

  it('passes the chosen tab through as the sort', async () => {
    await apiVideosFetcher({ take: 10, skip: 0, tags: ['fishing'], tagSort: 'recent' });
    expect(mockGet.mock.calls[0][1].params.sort).toBe('recent');
  });

  it('defaults to Top, the tab the hashtag page opens on', async () => {
    await apiVideosFetcher({ take: 10, skip: 0, tags: ['fishing'] });
    expect(mockGet.mock.calls[0][1].params.sort).toBe('top');
  });

  it('ignores an empty tag list rather than calling the wrong endpoint', async () => {
    await apiVideosFetcher({ take: 10, skip: 0, tags: [] });
    expect(mockPost).toHaveBeenCalled();
    expect(mockGet).not.toHaveBeenCalled();
  });
});
