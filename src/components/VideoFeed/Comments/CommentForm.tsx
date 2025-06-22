import React, { forwardRef, useMemo } from 'react';
import { BottomSheetTextInput, TouchableOpacity } from '@gorhom/bottom-sheet';
import { Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import {
  useVideoActions,
  useVideoPlayerStore,
} from '../../../state/videoPlayer/videoVideoPlayerStore.ts';
import clsx from 'clsx';

export interface CommentFormProps {
  onSubmit: (text: string) => void;
}
export const CommentForm = forwardRef<TextInput, CommentFormProps>(({ onSubmit }, ref) => {
  const text = useVideoPlayerStore((s) => s.commentText);
  const { setCommentText } = useVideoActions();

  const isEmpty = useMemo(() => !text.trim().length, [text]);

  return (
    <View className="flex-row items-center border-t border-t-[#333] bg-black1 p-[15px]">
      <BottomSheetTextInput
        ref={ref}
        className="h-10 flex-1 rounded-full bg-[#222] px-3 text-white"
        placeholder="Add a comment..."
        placeholderTextColor="#aaa"
        value={text}
        onChangeText={setCommentText}
      />
      <TouchableOpacity
        onPress={() => {
          onSubmit(text);
          setCommentText('');
        }}
        className={clsx('ml-2 rounded-[20px] bg-blue px-3.5 py-2', isEmpty && 'opacity-60')}
        disabled={isEmpty}
      >
        <Text className="font-bold text-white">Send</Text>
      </TouchableOpacity>
    </View>
  );
});
