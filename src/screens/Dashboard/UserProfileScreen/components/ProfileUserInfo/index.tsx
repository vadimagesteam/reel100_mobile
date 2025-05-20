import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, positionHelpers } from '../../../../../styles';
import { BodyText } from '../../../../../components/UI';
import ButtonGradient from '../../../../../components/ButtonGradient';
import { cs } from './styles';

interface ProfileUserInfoProps {
    fullname: string
    checkFollowButton: string
    onFollowPress: () => void
}

const ProfileUserInfo = ({ fullname, checkFollowButton, onFollowPress }: ProfileUserInfoProps) => {
    return (
        <>
            <View style={positionHelpers.alignCenter}>
                <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/9203/9203764.png' }} style={cs.avatarStyle} />
                <BodyText fontWeight={'700'} fontSize={20} color={colors.white} marginTop={5}>{fullname}</BodyText>
                <ButtonGradient
                    buttonStyles={cs.maxWidth30}
                    marginText={8}
                    title={checkFollowButton}
                    onPress={onFollowPress}
                />

            </View>
            <LinearGradient start={{ x: 0.1, y: 0.5 }}
                end={{ x: 0.9, y: 0 }}
                colors={[colors.blue1, colors.blue]}
                style={[positionHelpers.alignItemsCenterRow, cs.containerGradient]}>
                <TouchableOpacity style={[positionHelpers.center, positionHelpers.fill, cs.h100]}>
                    <BodyText fontWeight={'bold'} fontSize={20} color={colors.silver3}>0</BodyText>
                    <BodyText fontWeight={'500'} fontSize={16} color={colors.silver3} marginTop={3}>Followers</BodyText>
                </TouchableOpacity>
                <TouchableOpacity style={[positionHelpers.center, positionHelpers.fill, cs.h100, cs.likeContainer]}>
                    <BodyText fontWeight={'bold'} fontSize={20} color={colors.silver3}>0</BodyText>
                    <BodyText fontWeight={'500'} fontSize={16} color={colors.silver3} marginTop={3}>Likes</BodyText>
                </TouchableOpacity>
                <TouchableOpacity style={[positionHelpers.center, positionHelpers.fill, cs.h100]}>
                    <BodyText fontWeight={'bold'} fontSize={20} color={colors.silver3}>0</BodyText>
                    <BodyText fontWeight={'500'} fontSize={16} color={colors.silver3} marginTop={3}>Following</BodyText>
                </TouchableOpacity>

            </LinearGradient>
        </>
    );
};



export default ProfileUserInfo;
