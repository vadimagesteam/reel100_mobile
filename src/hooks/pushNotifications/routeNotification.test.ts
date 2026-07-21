/**
 * The shared router sends every notification type to the right screen. Used by
 * both push taps and the in-app center, so this is the single place that
 * mapping is verified.
 */
const mockNavigate = jest.fn();

jest.mock('../../navigation/navigationRef', () => ({
  navigationRef: { navigate: (...a: unknown[]) => mockNavigate(...a) },
}));

const { routeNotification } = require('./routeNotification');
const { MessageType } = require('./notificationDataType');

beforeEach(() => mockNavigate.mockClear());

test('chat routes to the Chat screen', () => {
  routeNotification({ type: MessageType.Chat, chatId: 'ch1', userId: 'u1' });
  expect(mockNavigate).toHaveBeenCalledWith('Chat', { chatId: 'ch1', userId: 'u1' });
});

test('follow routes to the follower profile', () => {
  routeNotification({ type: MessageType.Follow, userId: 'u1' });
  expect(mockNavigate).toHaveBeenCalledWith('Profile', { fromTabs: false, userId: 'u1' });
});

test('video like opens the video', () => {
  routeNotification({ type: MessageType.VideoLike, videoId: 'v1' });
  expect(mockNavigate).toHaveBeenCalledWith('VideoModal', { videoId: 'v1' });
});

test('comment lands on the comment, not just the video', () => {
  routeNotification({ type: MessageType.VideoComment, videoId: 'v1', commentId: 'c1' });
  expect(mockNavigate).toHaveBeenCalledWith('VideoModal', { videoId: 'v1', commentId: 'c1' });
});

test('comment-like also lands on the comment', () => {
  routeNotification({ type: MessageType.CommentLike, videoId: 'v1', commentId: 'c1' });
  expect(mockNavigate).toHaveBeenCalledWith('VideoModal', { videoId: 'v1', commentId: 'c1' });
});

test('video-processed opens the video', () => {
  routeNotification({ type: MessageType.VideoProcessed, videoId: 'v1' });
  expect(mockNavigate).toHaveBeenCalledWith('VideoModal', { videoId: 'v1' });
});

test('top100 opens the video', () => {
  routeNotification({ type: MessageType.Top100, videoId: 'v1', position: '3' });
  expect(mockNavigate).toHaveBeenCalledWith('VideoModal', { videoId: 'v1' });
});
