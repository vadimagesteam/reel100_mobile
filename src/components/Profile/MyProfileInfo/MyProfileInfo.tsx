import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../styles';
import SvgIcon from '../../ui/SvgIcon.tsx';
import CounterSection from './CounterSection.tsx';

interface ProfileInfoProps {
  fullName: string;
  followerCount: number | undefined;
  likeCount: number | undefined;
  followCount: number | undefined;
  onChatPress: () => void;
}

export const MyProfileInfo = ({
  fullName,
  followerCount,
  likeCount,
  followCount,
  onChatPress,
}: ProfileInfoProps) => {
  return (
    <>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center justify-center">
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/9203/9203764.png' }}
            className="size-[60px]"
          />
          <Text className="ml-[5px] text-[16px] font-bold text-silver4">{fullName}</Text>
        </View>
        <TouchableOpacity onPress={onChatPress}>
          <SvgIcon image="commentIcon" color={colors.white} style={styles.chatIcon} />
        </TouchableOpacity>
      </View>

      <View className="h-[70px] flex-row items-center justify-center rounded-[10px] bg-silver5">
        <CounterSection label="Followers" count={followerCount!} />
        <CounterSection label="Likes" count={likeCount!} />
        <CounterSection label="Following" count={followCount!} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  chatIcon: {
    height: 25,
    width: 25,
  },
});
