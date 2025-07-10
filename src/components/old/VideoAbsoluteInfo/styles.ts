import { StyleSheet } from 'react-native';
import { colors } from '../../../theme';

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
  left16: {
    left: 16,
  },
  iconFillLike: {
    height: 24,
    width: 24,
  },
  circleButton: {
    borderWidth: 1,
    borderRadius: '80%',
    borderColor: colors.white,
    padding: 12,
    backgroundColor: colors.silver3,
    opacity: 0.8,
    marginHorizontal: 5,
  },
  likeCountContainer: {
    minWidth: '30%',
    borderWidth: 1,
    borderRadius: 20,
    borderColor: colors.white,
    padding: 8,
    backgroundColor: colors.silver3,
    opacity: 0.8,
  },
  containerChat: {
    top: 40,
    right: 5,
  },
  containerShare: {
    top: 40 * 2 + 15,
    right: 5,
  },
  playContainer: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPlayStyle: {
    height: 50,
    width: 50,
  },
  iconStyle24: {
    height: 24,
    width: 24,
  },

  //SIMPLE
  containerNameSimple: {
    left: 4,
    top: 4,
  },
  noAvatarSimple: {
    padding: 10,
    borderRadius: '80%',
    backgroundColor: colors.blue1,
  },
  avatarSimple: {
    width: 15,
    height: 15,
    borderRadius: 16,
    marginRight: 8,
  },
  containerDurationSimple: {
    top: 5,
    right: 4,
  },
  likeContainerSimple: {
    bottom: 2,
    left: 2,
    paddingHorizontal: 3,
    paddingVertical: 3,
    borderRadius: 6,
  },
});
