import { Dimensions, StyleSheet } from 'react-native';

const { height, width } = Dimensions.get('screen');

export const cs = StyleSheet.create({
    videoWrapper: {
        flex: 1,
        // width: '100%',
        // height: '100%',
    },
    video: {
        width,
        height,
    },
    heart: {
        position: 'absolute',
        fontSize: 50,
        // opacity: 1,
    },
});
