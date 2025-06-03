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
    minWidth60: {
        width: 120,
    },
    containerChat: {
        justifyContent: 'flex-end',
        paddingBottom: 20,
        paddingRight: 20,

    },
    chatIcon: {
        height: 25,
        width: 25,
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
