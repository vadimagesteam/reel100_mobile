import { StyleSheet } from 'react-native';
import { colors } from '../../styles';

export const cs = StyleSheet.create({
    tabItem: {
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderColor: colors.black4,
    },
    tabItemActive: {
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderColor: colors.white,
    },
});
