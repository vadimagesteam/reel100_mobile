import React from 'react';
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChatPreview } from './types';
import { mockChatList } from './mockData';
import { BodyText } from '../../old/UI';
import { colors } from '../../../styles';
import { Screens } from '../../../navigation/screens.ts';

const ChatListScreen = () => {
  const navigation = useNavigation<any>();

  const renderItem = ({ item }: { item: ChatPreview }) => {
    return (
      <TouchableOpacity
        style={cs.itemContainer}
        // onPress={() => true}
        onPress={() =>
          navigation.navigate(Screens.Chat, {
            firstName: item?.firstName,
            lastName: item?.lastName,
          })
        }
      >
        {item.avatar !== '' ? (
          <Image source={{ uri: item.avatar }} style={cs.avatar} />
        ) : (
          <View style={{ height: 50, width: 50, borderRadius: '80%', backgroundColor: 'silver' }} />
        )}
        <View style={cs.textContainer}>
          <View style={cs.row}>
            <BodyText
              fontWeight={'bold'}
              fontSize={16}
              color={colors.white}
              marginLeft={5}
            >{`${item.firstName} ${item?.lastName}`}</BodyText>
            <BodyText fontSize={12} color={colors.silver2}>
              {formatTime(item.timestamp)}
            </BodyText>
          </View>
          <View style={cs.row}>
            <BodyText
              fontSize={14}
              flex={1}
              color={colors.silver2}
              marginTop={2}
              marginLeft={5}
              numberOfLines={1}
            >
              {item.lastMessage}
            </BodyText>
            {item.unreadCount ? (
              <View style={cs.unreadBadge}>
                <BodyText fontSize={12} color={colors.white}>
                  {item.unreadCount}
                </BodyText>
              </View>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return <FlatList data={mockChatList} renderItem={renderItem} keyExtractor={(item) => item.id} />;
};

export const cs = StyleSheet.create({
  input: {
    padding: 10,
    backgroundColor: '#1b1b1b',
    borderRadius: 8,
  },
  uploadVideoButton: {
    backgroundColor: colors.white1,
    padding: 16,
    borderRadius: 10,
  },
  mr15: {
    marginRight: 15,
  },
  ml15: {
    marginLeft: 15,
  },
  pb10: {
    paddingBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  itemContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#535159',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 28,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unreadBadge: {
    backgroundColor: '#2e89ff',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default ChatListScreen;
