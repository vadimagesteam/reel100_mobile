import { StyleSheet } from 'react-native';
import { colors } from '../../styles';

export const cs = StyleSheet.create({
    container: {
        marginRight: 16,
    },
    dropdownButton: {
        borderWidth: 1,
        borderColor: colors.black1,
        borderRadius: 5,
        padding: 12,
        backgroundColor: colors.black1,
    },
    dropdownList: {
        top: 45,
        width: '100%',
        backgroundColor: colors.black1,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderWidth: 1,
        borderColor: colors.black1,
        maxHeight: 200,
        zIndex: 1000,
        elevation: 5,
    },
    option: {
        padding: 12,
        borderBottomWidth: 0.2,
        borderBottomColor: colors.silver1,
    },
});
