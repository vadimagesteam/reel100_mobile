import clsx from 'clsx';
import { Platform, Text, TouchableOpacity } from 'react-native';
import { useVideoRecordStore } from '../videoRecordStore.ts';
import { SvgIcon } from '../../ui';
import React from 'react';

export const CloseButton = ({ onPress }: { onPress: () => void }) => {
  const { isPreviewReady } = useVideoRecordStore();
  return (
    <TouchableOpacity
      className={clsx(
        'absolute left-[20px] h-[35px] w-[35px] items-center justify-center rounded-[80%] bg-[rgba(134,131,130,0.7)]',
        Platform.select({
          ios: 'top-[50px]',
          android: 'top-[20px]',
        }),
      )}
      onPress={onPress}
    >
      {isPreviewReady ? (
        <SvgIcon image="backArrow" />
      ) : (
        <Text className={'text-[16px] text-white'}>&#x2715;</Text>
      )}
    </TouchableOpacity>
  );
};
