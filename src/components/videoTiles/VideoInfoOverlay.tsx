import React from 'react';
import { Text, View } from 'react-native';
import { getDisplayName } from '../../state/user/utils';
import { Avatar, SvgIcon } from '../ui';
import { VideoPost } from '../videoFeed/queries/apiVideosFetcher';

export interface VideoInfoOverlayProps {
  showUser?: boolean;
  showLikes?: boolean;
  showDuration?: boolean;
  video: VideoPost;
}

export const VideoInfoOverlay = ({
  showUser = true,
  showLikes = true,
  showDuration = true,
  video,
}: VideoInfoOverlayProps) => {
  const userDisplayName = getDisplayName(video.user);
  return (
    <View className="absolute bottom-0 left-0 top-0 size-full">
      <View className="w-full flex-row items-center justify-between">
        {showUser && (
          <View className="flex-row gap-x-1 pl-1 pt-1">
            <Avatar name={userDisplayName} uri={video.user.avatar} size={16} />
            <Text className="max-w-[80px] text-[12px] font-bold text-primary" numberOfLines={1}>
              {userDisplayName}
            </Text>
          </View>
        )}
        {showDuration && video.file?.duration && (
          <Text className="pr-1 font-bold text-primary">
            {Math.round(video.file?.duration / 1000)}s
          </Text>
        )}
      </View>
      {showLikes && (
        <View className="absolute bottom-1 left-1 flex-row gap-x-1">
          <SvgIcon image="like_heart" />
          <Text className="text-[16px] font-bold text-primary">{video.likesCount}</Text>
        </View>
      )}
    </View>
  );
};
