import clsx from 'clsx';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../theme';
import { formatTime } from '../../../utils';
import { MessageStatusIcon } from './MessageStatusIcon';

export interface MessageBubbleProps {
  text: string;
  isMy: boolean;
  createdAt: Date | string | number;
  sent: boolean;
  read: boolean;
}
export const MessageBubble = ({ isMy, text, createdAt, sent, read }: MessageBubbleProps) => (
  <View className={clsx('my-1.5 flex-1', isMy ? 'justify-end' : 'justify-start')}>
    <View
      className={clsx(
        'max-w-[80%] flex-col gap-1 rounded-[10px] p-2.5',
        isMy ? 'self-end bg-blue' : 'self-start bg-black1',
      )}
    >
      <Text className="text-[16px] text-primary">{text}</Text>
      <View className="flex-row items-center gap-1">
        <Text className="text-right text-[9px] text-silver1">{formatTime(createdAt as Date)}</Text>
        {isMy && <MessageStatusIcon sent={sent} read={read} />}
      </View>
    </View>
  </View>
);
