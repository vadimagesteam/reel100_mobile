import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

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
        backgroundColor: 'rgba(0,0,0,0.4)',
        zIndex: 999,
    },
});


export default LoaderIndicator;
