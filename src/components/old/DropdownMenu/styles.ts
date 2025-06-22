import { Platform, StyleSheet } from 'react-native';
import { colors } from '../../../styles';
import { isIOS } from '../../../utils/platformChecker.ts';

export const cs = StyleSheet.create({
    container: {
        marginRight: 16,
        // position: 'relative',
    },
    dropdownButton: {
        borderWidth: 1,
        borderColor: colors.black1,
        borderRadius: 5,
        padding: 11,
        backgroundColor: colors.black1,
    },
    dropdownList: {
        // position: isIOS() ? 'absolute' : 'static',
        top: 45,
        width: '100%',
        backgroundColor: colors.black1,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderWidth: 1,
        borderColor: colors.black1,
        maxHeight: 200,
        // zIndex: 9999,
        // zIndex: Platform.OS === 'android' ? 9999 : 1000,
        elevation: 10,
    },
    option: {
        padding: 12,
        borderBottomWidth: 0.2,
        borderBottomColor: colors.silver1,
    },
    selectedDot: {
        backgroundColor: colors.white,
        width: 10,
        height: 10,
        borderRadius: '80%',
    },
});
