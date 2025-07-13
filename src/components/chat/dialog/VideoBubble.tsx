import clsx from 'clsx';
import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '../../../navigation';
import { Screens } from '../../../navigation/screens';
import { VideoTile } from '../../videoTiles';
import { VideoPost } from '../../videoFeed/queries/apiVideosFetcher';

export interface MessageBubbleProps {
  text: string;
  isMy: boolean;
  createdAt: Date | string | number;
  sent: boolean;
  read: boolean;
  video: VideoPost;
}

export const VideoBubble = ({ video, isMy }: MessageBubbleProps) => {
  const navigation = useNavigation();
  const width = 174;
  const height = (width / 9) * 16;
  return (
    <View className={clsx('flex-1', isMy ? 'justify-end' : 'justify-start')}>
      <View
        className={clsx(
          'max-w-[80%] flex-col gap-1 rounded-[10px]',
          isMy ? 'self-end' : 'self-start',
        )}
      >
        <VideoTile
          index={0}
          className="mr-0"
          style={{ width, height }}
          item={video}
          onVideoPress={() => {
            navigation.navigate(Screens.VideoModal, {
              video,
            });
          }}
        />
      </View>
    </View>
  );
};
