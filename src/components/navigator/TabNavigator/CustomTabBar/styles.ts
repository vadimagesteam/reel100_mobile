import { StyleSheet } from 'react-native';
import { colors } from '../../../../styles';

export const cs = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 70,
        backgroundColor: colors.black4,
        // borderTopLeftRadius: 35,
        // borderTopRightRadius: 35,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    p5: {
        padding: 5,
    },
    br40: {
        borderRadius: 40,
    },
});
