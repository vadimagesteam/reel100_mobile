/**
 * A shared hashtag link goes through the same router as a push tap, so the two
 * can never disagree about where a tag leads.
 */
const mockNavigate = jest.fn();
jest.mock('../../navigation/navigationRef', () => ({
  navigationRef: { navigate: (...a: any[]) => mockNavigate(...a) },
}));

import { MessageType } from './notificationDataType';
import { routeNotification } from './routeNotification';

describe('routeNotification tag links', () => {
  beforeEach(() => mockNavigate.mockReset());

  it('opens the intersection a multi-tag link names', () => {
    routeNotification({ type: MessageType.Tag, tags: 'oregon,fishing' });
    expect(mockNavigate).toHaveBeenCalledWith('TagFeed', {
      tags: ['oregon', 'fishing'],
      title: '#oregon + #fishing',
    });
  });

  it('opens a single tag', () => {
    routeNotification({ type: MessageType.Tag, tags: 'fishing' });
    expect(mockNavigate).toHaveBeenCalledWith('TagFeed', {
      tags: ['fishing'],
      title: '#fishing',
    });
  });

  it('ignores stray separators rather than routing to a blank tag', () => {
    routeNotification({ type: MessageType.Tag, tags: 'oregon, ,fishing,' });
    expect(mockNavigate).toHaveBeenCalledWith('TagFeed', {
      tags: ['oregon', 'fishing'],
      title: '#oregon + #fishing',
    });
  });

  it('navigates nowhere when a link carries no tags', () => {
    routeNotification({ type: MessageType.Tag, tags: ' , ' });
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
