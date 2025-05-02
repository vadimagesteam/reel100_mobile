import React, { useRef, useState, useEffect } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { colors, positionHelpers } from '../../../../styles';
import CustomHeader from '../../../../components/navigator/CustomHeader';
import { useNavigation } from '@react-navigation/native';
import { DASHBOARD_ROUTES } from '../../../../navigation/routes';


const ProfileScreen = () => {
    const navigation = useNavigation<any>();
    return (
        <>
            <CustomHeader title="00:00:00" />
            <SafeAreaView style={[positionHelpers.fill, { backgroundColor: colors.black4 }]} >
                <View style={positionHelpers.fillCenter}>
                    <TouchableOpacity style={{ padding: 10 }} onPress={() => navigation.navigate(DASHBOARD_ROUTES.VIDEO_RECORD_SCREEN)}>
                        <Text style={{ color: '#fff' }}>Record video</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </>
    );
};

export default ProfileScreen;
