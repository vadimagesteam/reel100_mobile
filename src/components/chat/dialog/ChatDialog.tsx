import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import {
  GiftedChat,
  IMessage as GiftedChatMessageType,
  User,
  InputToolbar,
  Send,
} from 'react-native-gifted-chat';
import { BubbleProps } from 'react-native-gifted-chat/src/Bubble';
import { useRoute } from '../../../navigation';
import { useUser } from '../../../state/user/authStore';
import { getFullName } from '../../../state/user/utils';
import { colors } from '../../../theme';
import { useUserQuery } from '../../user/hooks/useUserQuery';
import { VideoPost } from '../../videoFeed/queries/apiVideosFetcher';
import { useChatMessages, useMarkMessagesAsRead, useSendMessage } from '../hooks';
import { DialogHeader } from './DialogHeader';
import { MessageBubble } from './MessageBubble';
import { VideoBubble } from './VideoBubble';

type IMessage = GiftedChatMessageType & {
  video: VideoPost | null;
  read: boolean;
};

export const ChatDialog = () => {
  const route = useRoute<'Chat'>();
  const { chatId: _chatId, userId: toUserId } = route?.params;
  const user = useUser();

  const [chatId, setChatId] = useState<string | undefined>(_chatId);

  const { data: interlocutor } = useUserQuery(toUserId);
  const { data: rawMessages } = useChatMessages(chatId);
  const sendMessage = useSendMessage();
  const markAsRead = useMarkMessagesAsRead();

  // mark unread messages as read
  useEffect(() => {
    if (rawMessages) {
      const hasUnread = rawMessages.some((m) => !m.isRead && m.to?.id === user.id);
      if (hasUnread) {
        const unreadIds = rawMessages
          .filter((m) => !m.isRead && m.to?.id === user.id)
          .map((m) => m.id);
        markAsRead.mutate({
          chatId: chatId!,
          messageIds: unreadIds,
        });
      }
    }
  }, [chatId, markAsRead, rawMessages, user.id]);

  const messages = useMemo(
    () =>
      (rawMessages ?? []).map(
        (msg) =>
          ({
            _id: msg.id,
            text: msg.text,
            createdAt: new Date(msg.createdAt),
            user: {
              _id: msg.fromField.id,
              name: getFullName(msg.fromField),
              avatar: msg.fromField.avatar || undefined,
            },
            sent: !msg.id.startsWith('tmp'),
            read: msg.isRead,
            video: msg.video,
          }) as IMessage,
      ),
    [rawMessages],
  );

  const onSend = useCallback(
    async (newMessages: IMessage[] = []) => {
      for (const msg of newMessages) {
        const response = await sendMessage.mutateAsync({
          chatId,
          toUserId,
          text: msg.text,
        });
        if (response?.chat?.id) {
          setChatId(response?.chat?.id);
        }
      }
    },
    [chatId, sendMessage, toUserId],
  );

  const renderBubble = ({ currentMessage }: BubbleProps<IMessage>) => {
    const isUser = currentMessage.user._id === user.id;
    const { text, createdAt, sent, read, video } = currentMessage;

    if (video) {
      return (
        <VideoBubble
          createdAt={createdAt}
          text={text}
          isMy={isUser}
          sent={!!sent}
          read={read}
          video={video}
        />
      );
    }

    return (
      <MessageBubble createdAt={createdAt} text={text} isMy={isUser} sent={!!sent} read={read} />
    );
  };

  const renderInputToolbar = (props: any) => (
    <InputToolbar
      {...props}
      containerStyle={styles.inputToolbar}
      primaryStyle={styles.inputToolbarPrimaryStyle}
    />
  );

  const renderSend = (props: any) => (
    <Send {...props} containerStyle={styles.sendButton}>
      <Text style={styles.sendIcon}>➤</Text>
    </Send>
  );

  const chatUser = useMemo<User>(
    () => ({
      _id: user.id,
      name: getFullName(user),
      avatar: user.avatar ?? undefined,
    }),
    [user],
  );

  return (
    <>
      <DialogHeader
        avatar={interlocutor?.avatar}
        displayName={interlocutor ? getFullName(interlocutor) : '...'}
      />
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={chatUser}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderSend={renderSend}
        placeholder="Write a message..."
        alwaysShowSend
        showUserAvatar={false}
        keyboardShouldPersistTaps="handled"
        messagesContainerStyle={styles.messagesContainer}
        // @ts-expect-error Types issue
        textInputStyle={styles.textInput}
      />
    </>
  );
};

const styles = StyleSheet.create({
  inputToolbar: {
    backgroundColor: colors.black4,
    paddingVertical: 10,
    paddingBottom: 20,
    paddingHorizontal: 8,
    borderTopWidth: 0,
  },
  inputToolbarPrimaryStyle: { alignItems: 'center' },
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
