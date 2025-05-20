import { Dimensions, StyleSheet } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const half = screenWidth / 2;

export const cs = StyleSheet.create({
    blockRow: {
        flexDirection: 'row',
        marginBottom: 2,
    },
    smallBox: {
        width: half,
        height: half,
        marginVertical: 3,
    },
    bigBox: {
        width: half,
        height: half * 2,
        margin: 3,
    },
});
