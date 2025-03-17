import { StyleSheet } from 'react-native';
import { colors } from '../../../../../styles';

export const cs = StyleSheet.create({
    containerInputEmail: {
        padding: 18,
        borderRadius: 3,
    },
    containerInputPassword: {
        paddingVertical: 18,
        padding: 0,
        paddingLeft: 18,
        paddingRight: 40,
        borderRadius: 3,
    },
    inputText: {
        fontWeight: '600',
        fontSize: 14,
        color: colors.white,
    },
});
