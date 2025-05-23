import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors, positionHelpers } from '../../styles';

interface LoaderIndicatorProps {
    variantTwo?: boolean
}
const LoaderIndicator = ({ variantTwo }: LoaderIndicatorProps) => {
    return (
        <>
            {variantTwo ? (
                <View style={positionHelpers.fillCenter}>
                    <ActivityIndicator size="small" color="#fff" />
                </View>
            ) : (
                <View style={cs.container}>
                    <ActivityIndicator size="small" color="#fff" />
                </View>
            )}
        </>
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
