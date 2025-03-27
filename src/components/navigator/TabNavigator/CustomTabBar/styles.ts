import { StyleSheet } from 'react-native';
import { colors } from '../../../../styles';

export const cs = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 70,
        backgroundColor: colors.black4,
        borderTopWidth: 1,
        borderTopColor: colors.silver1Procent50,
    },
    p5: {
        padding: 5,
    },
    br40: {
        borderRadius: 40,
    },
});
