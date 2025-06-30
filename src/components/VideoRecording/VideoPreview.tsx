import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Video from 'react-native-video';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../ui/Button.tsx';
import { useVideoRecordStore } from './videoRecordStore.ts';
import { useStateSelector } from '../../state/app/uiStore.ts';
import { useNavigation } from '@react-navigation/native';

export interface VideoPreviewProps {}

export const VideoPreview = ({}: VideoPreviewProps) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [volume, setVolume] = useState(1);
  const { previewUri, error, uploading, actions } = useVideoRecordStore();
  const [selectedState] = useStateSelector();

  useEffect(() => {
    setVolume(uploading ? 0 : 1);
  }, [uploading]);

  const handlePublish = async () => {
    if (!selectedState?.id) {
      console.error('State is not selected');
      return;
    }

    const uploadOk = await actions.publish(selectedState.id);
    if (uploadOk) {
      actions.clear();
      navigation.goBack();
    }
  };

  return (
    <>
      <Video
        source={{ uri: previewUri! }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        volume={volume}
        disableAudioSessionManagement
        repeat
        onLoad={() => actions.setIsPreviewReady(true)}
      />

      <View
        className="absolute left-0 top-0 h-full w-full items-center justify-center"
        style={{ display: uploading ? 'flex' : 'none' }}
      >
        <View className="absolute h-full w-full bg-black/60" />
        {error ? (
          <View className="flex-col gap-2">
            <Text className="text-xl text-red1">Error! {error?.message}</Text>
            <Button size="sm" variant="primary" onPress={handlePublish}>
              retry
            </Button>
          </View>
        ) : (
          <Text className="text-xl text-white">Uploading...</Text>
        )}
      </View>

      <View
        className="absolute left-0 w-full flex-row justify-between px-16"
        style={{ bottom: insets.bottom, display: uploading ? 'none' : 'flex' }}
      >
        <Button variant="primary" onPress={handlePublish}>
          Publish Now
        </Button>
        <Button variant="primary" buttonClassName="bg-silver" onPress={() => {}}>
          Save Draft
        </Button>
      </View>
    </>
  );
};
