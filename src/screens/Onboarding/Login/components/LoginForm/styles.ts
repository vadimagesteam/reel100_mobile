import { StyleSheet } from 'react-native';
import { colors } from '../../../../../styles';

export const cs = StyleSheet.create({
    containerInputEmail: {
        padding: 15,
        borderRadius: 3,
        borderWidth: 1,
    },
    containerInputPassword: {
        paddingVertical: 15,
        padding: 0,
        paddingLeft: 18,
        paddingRight: 40,
        borderRadius: 3,
        borderWidth: 1,
    },
    inputText: {
        fontWeight: '600',
        fontSize: 14,
        color: colors.white,
    },
});
