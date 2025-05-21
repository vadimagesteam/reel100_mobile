import { StyleSheet } from 'react-native';
import { colors } from '../../../../../styles';

export const cs = StyleSheet.create({
    avatarStyle: {
        height: 70,
        width: 70,
    },
    containerGradient: {
        height: 70,
        borderRadius: 10,
    },
    maxWidth30: {
        maxWidth: '30%',
    },
    h100: {
        height: '100%',
    },
    likeContainer: {
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
        borderRightColor: colors.silver1,
        borderLeftColor: colors.silver1,
    },
});
