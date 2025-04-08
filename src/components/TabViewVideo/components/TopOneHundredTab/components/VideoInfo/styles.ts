import { StyleSheet } from 'react-native';
import { colors } from '../../../../../../styles';

export const cs = StyleSheet.create({
    containerName: {
        top: 10,
        left: 10,
    },
    noAvatar: {
        padding: 15,
        borderRadius: '80%',
        backgroundColor: colors.blue1,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
    },
    containerDuration: {
        top: 15,
        right: 10,
    },
    videoNumberContainer: {
        backgroundColor: colors.orange,
        padding: 3,
        borderRadius: 4,
    },
    videoDurationContainer: {
        backgroundColor: colors.black5,
        padding: 3,
        borderRadius: 4,
        marginLeft: 5,
        opacity: 0.8,
    },
    containerLikes: {
        bottom: 40,
        left: 0,
        right: 0,
    },
    likeCountContainer: {
        minWidth: '30%',
        borderWidth: 1,
        borderRadius: 20,
        borderColor: colors.white,
        padding: 10,
        backgroundColor: colors.silver3,
        opacity: 0.8,
    },
});
