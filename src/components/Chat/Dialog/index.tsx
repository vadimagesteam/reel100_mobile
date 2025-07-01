import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { GiftedChat, IMessage, User, InputToolbar, Send } from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, positionHelpers } from '../../../styles';
import { BodyText, SvgIcon } from '../../old/UI';
import { getInitialsName } from '../../../utils/getInitialsName.ts';

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

  const paddingInsets = insets.top ? insets.top + 8 : 17;
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
          <Image source={{ uri: props.currentMessage.user.avatar }} style={styles.avatar} />
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
          {!isUser && <Text style={styles.sender}>{props.currentMessage.user.name}</Text>}
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
        style={[
          positionHelpers.rowFillCenter,
          positionHelpers.ph16,
          {
            paddingTop: paddingInsets,
            paddingBottom: 8,
            backgroundColor: colors.black,
            borderBottomWidth: 0.5,
            borderBottomColor: colors.silver,
          },
        ]}
      >
        <View style={[positionHelpers.alignItemsCenterRow]}>
          <TouchableOpacity
            hitSlop={{ left: 8, top: 9, right: 8, bottom: 9 }}
            onPress={() => navigation.goBack()}
          >
            <SvgIcon image="backArrow" />
          </TouchableOpacity>
          <View style={[positionHelpers.alignItemsCenterRow, { marginLeft: 10 }]}>
            <View
              style={[
                positionHelpers.center,
                { height: 40, width: 40, borderRadius: '80%', backgroundColor: colors.blue },
              ]}
            >
              <BodyText fontWeight={'bold'} fontSize={16} color={colors.white}>
                {getInitialsName(params?.firstName, params?.lastName)}
              </BodyText>
            </View>
            <View style={{ marginLeft: 10 }}>
              <BodyText
                fontSize={14}
                color={colors.white}
              >{`${params?.firstName} ${params?.lastName}`}</BodyText>
              <BodyText fontSize={14} color={colors.silver} marginTop={2}>
                a few seconds ago
              </BodyText>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={{ backgroundColor: colors.red, padding: 4, borderRadius: 5 }}
          onPress={() => true}
        >
          <BodyText fontWeight={'500'} fontSize={14} color={colors.white}>
            {'Block user'}
          </BodyText>
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
  sender: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#fff',
  },
  timestamp: {
    fontSize: 10,
    color: '#fff',
    // color: '#555',
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
    backgroundColor: '#111',
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
    backgroundColor: '#000',
  },
  textInput: {
    color: '#fff',
    // backgroundColor: '#222',
    // borderRadius: 20,
    // paddingHorizontal: 15,
    fontSize: 16,
  },
});

export default ChatDialog;
