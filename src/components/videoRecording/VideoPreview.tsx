import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import Video from 'react-native-video';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLoadingCallback } from '../../hooks/useLoadingCallback';
import { isAndroid } from '../../utils';
import { Button } from '../ui';
import { requestCameraRollSavePermissions } from './requestCameraRollSave';
import { VideoDescriptionInput } from './VideoDescriptionInput';
import { useVideoRecordStore } from './videoRecordStore';
import { useStateSelector } from '../../state/app/uiStore';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useUser } from '../../state/user/authStore';

export const VideoPreview = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const user = useUser();
  const [volume, setVolume] = useState(1);
  const [description, setDescription] = useState('');
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

    const uploadOk = await actions.publish(selectedState.id, description);
    if (uploadOk) {
      actions.clear();
      await queryClient.invalidateQueries({ queryKey: ['user_videos', user.id] });
      navigation.goBack();
    }
  };

  const [handleDraft, isSavingDraft] = useLoadingCallback(async () => {
    let saved = false;
    try {
      const saveResult = await requestCameraRollSavePermissions();
      if (!isAndroid && !saveResult) {
        Alert.alert(
          'Unable to save video',
          'We need permissions to save video to your camera roll',
        );
      }
      await CameraRoll.saveAsset(`file://${previewUri}`, {
        type: 'video',
      });
      saved = true;
    } catch (e) {
      // Weird behaviour - the video is saved,
      // but this error is thrown when "add only" option selected
      // https://github.com/react-native-cameraroll/react-native-cameraroll/issues/617
      if ((e as Error).message.includes('Unknown error from a native module')) {
        saved = true;
      } else {
        Alert.alert('Unable to save video', (e as Error).message);
      }
    } finally {
      if (saved) {
        Alert.alert('Saved', 'Video saved into your camera roll');
        actions.clear();
        navigation.goBack();
      }
    }
  });

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
      {!uploading && <VideoDescriptionInput value={description} setValue={setDescription} />}
      <View
        className={clsx(
          'absolute left-0 top-0 h-full w-full items-center justify-center',
          !uploading && 'hidden',
        )}
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
          <Text className="text-xl text-primary">Uploading...</Text>
        )}
      </View>

      <View
        className="absolute left-0 w-full flex-row justify-between px-16"
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          bottom: insets.bottom + (isAndroid ? 10 : 0),
          display: uploading ? 'none' : 'flex',
        }}
      >
        <Button variant="primary" onPress={handlePublish}>
          Publish Now
        </Button>
        <Button
          loading={isSavingDraft}
          loadingText="Saving..."
          variant="outline"
          onPress={handleDraft}
        >
          Save Draft
        </Button>
      </View>
    </>
  );
};
