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
        backgroundColor: colors.black,
        zIndex: 999,
    },
});


export default LoaderIndicator;
