import React, { forwardRef, useMemo } from 'react';
import { BottomSheetTextInput, TouchableOpacity } from '@gorhom/bottom-sheet';
import { Text } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import clsx from 'clsx';
import { useNavigationBarInset } from '../../../hooks/useNavigationBarInset';
import { useNavigationBarInsetPadding } from '../../../hooks/useNavigationBarInsetPadding';
import { useVideoComments, useVideoFeed } from '../hooks';

export interface CommentFormProps {
  onSubmit: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}
export const CommentForm = forwardRef<TextInput, CommentFormProps>(
  ({ onSubmit, onFocus, onBlur }, ref) => {
    const { text, setCommentText } = useVideoComments();
    const isEmpty = useMemo(() => !text.trim().length, [text]);

    // In a full-screen video the sheet reaches the bottom edge, under the
    // Android navigation bar; in the tabs it ends above the tab bar instead.
    const screenType = useVideoFeed((s) => s.screenType);
    const navBarInset = useNavigationBarInset();
    const bottomPaddingStyle = useNavigationBarInsetPadding(
      15,
      screenType === 'modal' ? navBarInset : 0,
    );

    return (
      <Animated.View
        style={bottomPaddingStyle}
        className="flex-row items-end border-t border-t-[#333] bg-surface p-[15px]"
      >
        <BottomSheetTextInput
          ref={ref}
          multiline
          textAlignVertical="top"
          className="max-h-[120px] min-h-[40px] flex-1 rounded-2xl bg-[#222] px-3 py-2 text-primary"
          placeholder="Add a comment..."
          placeholderTextColor="#aaa"
          value={text}
          onChangeText={setCommentText}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <TouchableOpacity
          onPress={() => {
            onSubmit(text);
            setCommentText('');
          }}
          className={clsx('ml-2 rounded-xl bg-button-primary px-3.5 py-2', isEmpty && 'opacity-60')}
          disabled={isEmpty}
        >
          <Text className="button-primary-text font-bold">Send</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  },
);
