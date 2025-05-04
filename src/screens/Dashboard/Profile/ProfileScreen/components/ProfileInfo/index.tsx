import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { BodyText } from '../../../../../../components/UI';
import { colors, positionHelpers } from '../../../../../../styles';

const ProfileInfo = () => {
    return (
        <>
            <View style={[positionHelpers.mt20, positionHelpers.alignItemsCenterRow]}>
                <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/9203/9203764.png' }} style={{ height: 60, width: 60 }} />
                <BodyText fontWeight={'bold'} marginLeft={5} fontSize={16} color={colors.silver4}>Firstname Lastname</BodyText>
            </View>

            <View style={[positionHelpers.mt15, positionHelpers.alignItemsCenterRow, { height: 70, backgroundColor: colors.silver5, borderRadius: 10 }]}>
                <TouchableOpacity style={[positionHelpers.center, positionHelpers.fill, { height: '100%' }]}>
                    <BodyText fontWeight={'bold'} fontSize={20} color={colors.silver3}>0</BodyText>
                    <BodyText fontWeight={'500'} fontSize={16} color={colors.silver3} marginTop={3}>Followers</BodyText>
                </TouchableOpacity>
                <TouchableOpacity style={[positionHelpers.center, positionHelpers.fill, { height: '100%' }]}>
                    <BodyText fontWeight={'bold'} fontSize={20} color={colors.silver3}>0</BodyText>
                    <BodyText fontWeight={'500'} fontSize={16} color={colors.silver3} marginTop={3}>Likes</BodyText>
                </TouchableOpacity>
                <TouchableOpacity style={[positionHelpers.center, positionHelpers.fill, { height: '100%' }]}>
                    <BodyText fontWeight={'bold'} fontSize={20} color={colors.silver3}>0</BodyText>
                    <BodyText fontWeight={'500'} fontSize={16} color={colors.silver3} marginTop={3}>Following</BodyText>
                </TouchableOpacity>
            </View>
        </>
    );
};

export default ProfileInfo;
