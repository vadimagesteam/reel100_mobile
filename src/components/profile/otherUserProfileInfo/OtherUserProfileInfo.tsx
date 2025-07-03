import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, positionHelpers } from '../../../styles';
import ButtonGradient from '../../old/ButtonGradient';
import { Avatar } from '../../ui/Avatar';
import SvgIcon from '../../ui/SvgIcon';
import CounterSection from '../myProfileInfo/CounterSection.tsx';

interface ProfileUserInfoProps {
  fullname: string;
  followerCount: number | undefined;
  likeCount: number | undefined;
  followCount: number | undefined;
  checkFollowButton: string;
  onFollowPress: () => void;
  onChatPress: () => void;
}

export const ProfileUserInfo = ({
  fullname,
  followerCount,
  likeCount,
  followCount,
  checkFollowButton,
  onFollowPress,
  onChatPress,
}: ProfileUserInfoProps) => {
  return (
    <>
      <View className="flex-row justify-between">
        <TouchableOpacity disabled={true} className="opacity-0" onPress={() => true}>
          <SvgIcon image="commentIcon" style={styles.chatIcon} color={colors.white} />
        </TouchableOpacity>
        <View className="items-center">
          <View className="items-center">
            <Avatar name={fullname} size={70} />
            <Text className="ml-[5px] text-[20px] font-bold text-white">{fullname}</Text>
          </View>
          <ButtonGradient
            buttonStyles={styles.minWidth60}
            marginText={8}
            title={checkFollowButton}
            onPress={onFollowPress}
          />
        </View>
        <TouchableOpacity className="justify-end pb-[20px] pr-[20px]" onPress={onChatPress}>
          <SvgIcon image="commentIcon" color={colors.white} style={styles.chatIcon} />
        </TouchableOpacity>
      </View>

      <LinearGradient
        start={{ x: 0.1, y: 0.5 }}
        end={{ x: 0.9, y: 0 }}
        colors={[colors.blue1, colors.blue]}
        style={[positionHelpers.alignItemsCenterRow, styles.containerGradient]}
      >
        <CounterSection label="Followers" count={followerCount!} />
        <CounterSection
          className="border-l-[0.5px] border-r-[0.5px] border-l-silver3 border-r-silver3"
          label="Likes"
          count={likeCount!}
        />
        <CounterSection label="Following" count={followCount!} />
      </LinearGradient>
    </>
  );
};

export const styles = StyleSheet.create({
  containerGradient: {
    height: 70,
    borderRadius: 10,
  },
  minWidth60: {
    width: 120,
  },
  chatIcon: {
    height: 25,
    width: 25,
  },
});
