import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { BodyText } from '../../../../../../components/UI';
import { colors, positionHelpers } from '../../../../../../styles';

interface ProfileInfoProps {
    fullName: string
    followerCount: number | undefined
    likeCount: number | undefined
    followCount: number | undefined
}

const ProfileInfo = ({ fullName, followerCount, likeCount, followCount }: ProfileInfoProps) => {
    return (
        <>
            <View style={[positionHelpers.mt20, positionHelpers.alignItemsCenterRow]}>
                <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/9203/9203764.png' }} style={{ height: 60, width: 60 }} />
                <BodyText fontWeight={'bold'} marginLeft={5} fontSize={16} color={colors.silver4}>{fullName}</BodyText>
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
});
export default ProfileInfo;
