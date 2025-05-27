import { Dimensions, StyleSheet } from 'react-native';

const { height, width } = Dimensions.get('screen');

export const cs = StyleSheet.create({
    videoWrapper: {
        flex: 1,
        // width,
        // height,
    },
    video: {
        width,
        height,
        // width: '100%',
        // height: '100%',
    },
    heart: {
        position: 'absolute',
        fontSize: 50,
    },
});
