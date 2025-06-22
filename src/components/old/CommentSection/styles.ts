import { StyleSheet } from 'react-native';
import { colors } from '../../../styles';

export const cs = StyleSheet.create({
  container: {
    flex: 2.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  commentItem: {
    marginBottom: 5,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#1c1c1b',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingBottom: 25,
    backgroundColor: colors.black1,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#222',
    borderRadius: 20,
    paddingHorizontal: 12,
    color: '#fff',
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: colors.blue,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  p16: {
    padding: 16,
  },
  avatarStyle: {
    height: 30,
    width: 30,
  },
  ml45: {
    marginLeft: 45,
  },
  replayCommentContainer: {
    paddingHorizontal: 10,
    padding: 10,
    backgroundColor: colors.black1,
  },
});
