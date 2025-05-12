import { Dimensions, StyleSheet } from 'react-native';
import { colors } from '../../../../styles';

const { height, width } = Dimensions.get('window');

export const cs = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.black4,
        // justifyContent: 'center',
        // height: height,
    },
    video: {
        width: width,
        height: height,
    },
});
