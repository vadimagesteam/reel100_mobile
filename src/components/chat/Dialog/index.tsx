import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GiftedChat, IMessage, User, InputToolbar, Send } from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getFullName } from '../../../state/user/utils';
import { colors } from '../../../theme';
import { HeaderBackArrowButton } from '../../appHeader';
import { Avatar } from '../../ui';

const user: User = {
  _id: 1,
  name: 'You',
  avatar: '',
};

const ChatDialog = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const params = route?.params;
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState<IMessage[]>([]);

  console.log('fullName-->', params);

  useEffect(() => {
    setMessages([
      {
        _id: 3,
        text: 'Goood!',
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'Andy',
          avatar: '',
        },
      },
      {
        _id: 2,
        text: 'Hello',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Alyp',
          avatar: '',
        },
      },
      {
        _id: 1,
        text: 'Hello! How are you?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Alyp',
          avatar: '',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
  }, []);

  const renderBubble = (props: any) => {
    const isUser = props.currentMessage.user._id === user._id;

    return (
      <View
        style={[styles.messageContainer, { justifyContent: isUser ? 'flex-end' : 'flex-start' }]}
      >
        {!isUser && props.currentMessage.user.avatar ? (
          <Avatar name="B B" uri={props.currentMessage.user.avatar} style={styles.avatar} />
        ) : null}

        <View
          style={[
            styles.bubble,
            {
              backgroundColor: isUser ? colors.blue : colors.black1,
              alignSelf: isUser ? 'flex-end' : 'flex-start',
            },
          ]}
        >
          {!isUser && (
            <Text className="mb-[5px] font-bold text-primary">
              {props.currentMessage.user.name}
            </Text>
          )}
          <Text style={styles.text}>{props.currentMessage.text}</Text>
          <Text style={styles.timestamp}>
            {new Date(props.currentMessage.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
    );
  };
  const renderInputToolbar = (props: any) => (
    <InputToolbar
      {...props}
      containerStyle={styles.inputToolbar}
      primaryStyle={{ alignItems: 'center' }}
    />
  );

  const renderSend = (props: any) => (
    <Send {...props} containerStyle={styles.sendButton}>
      <Text style={styles.sendIcon}>➤</Text>
    </Send>
  );

  return (
    <>
      <View
        className="flex-row items-center justify-between border-b-[0.5px] border-b-silver px-4 pb-2"
        style={{ paddingTop: insets.top }}
      >
        <View className="flex-row items-center gap-2.5">
          <HeaderBackArrowButton />
          <View className="flex-row gap-2.5">
            <Avatar name={getFullName(params)} size={40} />
            <View className="flex-col gap-0.5">
              <Text className="text-sm text-primary">{`${params?.firstName} ${params?.lastName}`}</Text>
              <Text className="text-muted text-primary">a few seconds ago</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity className="rounded-[6px] bg-danger p-1" onPress={() => true}>
          <Text className="text-base font-medium text-primary">Block user</Text>
        </TouchableOpacity>
      </View>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={user}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderSend={renderSend}
        placeholder="Write a message..."
        alwaysShowSend
        showUserAvatar={false}
        messagesContainerStyle={styles.messagesContainer}
        //@ts-expect-error Types issue
        textInputStyle={styles.textInput}
      />
    </>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    flex: 1,
    marginVertical: 6,
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  otherMessage: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    backgroundColor: '#e1ffc7',
    borderRadius: 10,
    padding: 10,
  },
  text: {
    fontSize: 16,
    color: '#fff',
  },
  timestamp: {
    fontSize: 10,
    color: colors.primary,
    marginVertical: 5,
    textAlign: 'right',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
    alignSelf: 'flex-end',
  },
  inputToolbar: {
    backgroundColor: colors.black4,
    borderTopWidth: 0,
    paddingVertical: 10,
    paddingBottom: 20,
    paddingHorizontal: 8,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  sendIcon: {
    fontSize: 30,
    color: '#007aff',
  },
  messagesContainer: {
    backgroundColor: colors.black,
  },
  textInput: {
    color: colors.primary,
    fontSize: 16,
  },
});

export default ChatDialog;
