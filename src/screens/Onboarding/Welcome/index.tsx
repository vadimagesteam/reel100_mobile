import React from 'react';
import { Text, View } from 'react-native';
import { positionHelpers } from '../../../styles';

const WelcomeScreen = () => {
    return (
        <View style={positionHelpers.fillCenter}>
            <Text>Welcome Screen</Text>
        </View>
    );
};

export default WelcomeScreen;
