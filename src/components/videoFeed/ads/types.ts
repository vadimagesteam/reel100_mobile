import type { NativeAd } from 'react-native-google-mobile-ads';
import type { VideoPost } from '../queries/apiVideosFetcher';

export type VideoFeedItem = {
  type: 'video';
  data: VideoPost;
  key: string;
};

export type AdFeedItem = {
  type: 'ad';
  data: NativeAd | null;
  key: string;
};

export type FeedItem = VideoFeedItem | AdFeedItem;

export const AD_INTERVAL = 5;
