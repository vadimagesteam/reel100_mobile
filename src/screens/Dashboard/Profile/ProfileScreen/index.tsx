import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import CustomHeader from '../../../../navigation/CustomHeader';
import { colors, positionHelpers } from '../../../../styles';

const ProfileScreen = () => {
    return (
        <>
            <CustomHeader title="00:00:00" />
            <SafeAreaView style={[positionHelpers.fill, { backgroundColor: colors.black4 }]} >
                <View style={positionHelpers.fillCenter}>
                    <Text style={{ color: '#fff' }}>Profile Screen</Text>
                </View>
            </SafeAreaView>
        </>
    );
};

export default ProfileScreen;
