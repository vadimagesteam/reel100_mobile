import Ionicons from '@react-native-vector-icons/ionicons';
import React from 'react';

export const MessageStatusIcon = ({ sent, read }: { sent: boolean; read: boolean }) => (
  <Ionicons
    name={sent ? (read ? 'checkmark-done' : 'checkmark') : 'time-outline'}
    size={14}
    color={sent ? (read ? '#4f9df9' : '#aaa') : '#999'}
  />
);
