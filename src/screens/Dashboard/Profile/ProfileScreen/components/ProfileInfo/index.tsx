import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { BodyText, SvgIcon } from '../../../../../../components/old/UI';
import { colors, positionHelpers } from '../../../../../../styles';

interface ProfileInfoProps {
    fullName: string
    followerCount: number | undefined
    likeCount: number | undefined
    followCount: number | undefined
    onChatPress: () => void
}

const ProfileInfo = ({ fullName, followerCount, likeCount, followCount, onChatPress }: ProfileInfoProps) => {
    return (
        <>
            <View style={[positionHelpers.mt20, positionHelpers.rowFillCenter]}>
                <View style={positionHelpers.alignItemsCenterRow}>
                    <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/9203/9203764.png' }} style={{ height: 60, width: 60 }} />
                    <BodyText fontWeight={'bold'} marginLeft={5} fontSize={16} color={colors.silver4}>{fullName}</BodyText>
                </View>
                <TouchableOpacity onPress={onChatPress}>
                    <SvgIcon image="commentIcon" color={colors.white} style={cs.chatIcon} />
                </TouchableOpacity>
            </View>

            <View style={[positionHelpers.mt15, positionHelpers.alignItemsCenterRow, cs.containerStats]}>
                <TouchableOpacity style={[positionHelpers.center, positionHelpers.fill, cs.h100]}>
                    <BodyText fontWeight={'bold'} fontSize={20} color={colors.silver3}>{followerCount}</BodyText>
                    <BodyText fontWeight={'500'} fontSize={16} color={colors.silver3} marginTop={3}>Followers</BodyText>
                </TouchableOpacity>
                <TouchableOpacity style={[positionHelpers.center, positionHelpers.fill, cs.h100]}>
                    <BodyText fontWeight={'bold'} fontSize={20} color={colors.silver3}>{likeCount}</BodyText>
                    <BodyText fontWeight={'500'} fontSize={16} color={colors.silver3} marginTop={3}>Likes</BodyText>
                </TouchableOpacity>
                <TouchableOpacity style={[positionHelpers.center, positionHelpers.fill, cs.h100]}>
                    <BodyText fontWeight={'bold'} fontSize={20} color={colors.silver3}>{followCount}</BodyText>
                    <BodyText fontWeight={'500'} fontSize={16} color={colors.silver3} marginTop={3}>Following</BodyText>
                </TouchableOpacity>
            </View>
        </>
    );
};

const cs = StyleSheet.create({
    containerStats: {
        height: 70,
        backgroundColor: colors.silver5,
        borderRadius: 10,
    },
    h100: {
        height: '100%',
    },
    chatIcon: {
        height: 25,
        width: 25,
    },
});
export default ProfileInfo;
