import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors } from '../../styles';

const LoaderIndicator = () => {
    return (
        <View style={cs.container}>
            <ActivityIndicator size="small" color="#fff" />
        </View>
    );
};

const cs = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.black1,
        zIndex: 999,
    },
});


export default LoaderIndicator;
