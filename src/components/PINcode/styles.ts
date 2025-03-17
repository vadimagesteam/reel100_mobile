import { StyleSheet } from 'react-native';
import { colors } from '../../styles';

export const cs = StyleSheet.create({
    inputStyle: {
        position: 'absolute',
        width: 1,
        height: 1,
        opacity: 0,
        color: '#fff',
    },
    containerSquare: {
        width: 50,
        height: 50,
        borderWidth: 2,
        borderColor: colors.silver1,
        borderRadius: 10,
        marginHorizontal: 5,
        backgroundColor: colors.white,
    },
});
