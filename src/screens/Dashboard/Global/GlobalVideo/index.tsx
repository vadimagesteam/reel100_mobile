import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { colors, positionHelpers } from '../../../../styles';
import CustomHeader from '../../../../components/navigator/CustomHeader';

const GlobalVideoScreen = () => {
    return (
        <>
            <CustomHeader title="00:00:00" />
            <SafeAreaView style={[positionHelpers.fill, { backgroundColor: colors.black4 }]} >
                <View style={positionHelpers.fillCenter}>
                    <Text style={{ color: '#fff' }}>Global Video Screen</Text>
                </View>
            </SafeAreaView>
        </>
    );
};

export default GlobalVideoScreen;
