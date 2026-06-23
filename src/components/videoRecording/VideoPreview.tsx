import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import clsx from 'clsx';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Video from 'react-native-video';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLoadingCallback } from '../../hooks/useLoadingCallback';
import { useNavigation } from '../../navigation';
import { Screens, Tabs } from '../../navigation/screens';
import { isAndroid } from '../../utils';
import { Button, SvgIcon } from '../ui';
import { requestCameraRollSavePermissions } from './requestCameraRollSave';
import { VideoDescriptionInput } from './VideoDescriptionInput';
import { useVideoRecordStore } from './videoRecordStore';
import { StateItem, useDetectedStateSelector, useStateSelector } from '../../state/app/uiStore';
import { useQueryClient } from '@tanstack/react-query';
import { useUser } from '../../state/user/authStore';
import { colors } from '../../theme';

export const VideoPreview = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const user = useUser();
  const [volume, setVolume] = useState(1);
  const [description, setDescription] = useState('');
  const { previewUri, error, uploading, uploadProgress, actions } = useVideoRecordStore();
  const [selectedState] = useStateSelector();
  const [detectedState] = useDetectedStateSelector();

  // The state this video will be posted to. Defaults to the user's physical
  // location and falls back to the browse filter only until geolocation
  // resolves. It is shown and editable below so a user browsing another state's
  // rankings never silently posts there (the cause of the wrong-state uploads).
  const [targetState, setTargetState] = useState<StateItem | null>(
    detectedState ?? selectedState ?? null,
  );
  const targetPickedRef = useRef(false);

  // Geolocation resolves asynchronously; adopt it as the default once it lands,
  // unless the user has already chosen a state for this upload.
  useEffect(() => {
    if (!targetPickedRef.current && detectedState) {
      setTargetState(detectedState);
    }
  }, [detectedState]);

  const openStatePicker = () => {
    navigation.navigate(Screens.SelectState, {
      placeholderValue: targetState?.label,
      onSelected: (state) => {
        targetPickedRef.current = true;
        setTargetState(state);
      },
    });
  };

  const videoSource = useMemo(() => {
    if (!previewUri) {
      return undefined;
    }
    const uri = previewUri.startsWith('file://') ? previewUri : `file://${previewUri}`;
    return { uri };
  }, [previewUri]);

  useEffect(() => {
    setVolume(uploading ? 0 : 1);
  }, [uploading]);

  const handlePublish = async () => {
    if (!targetState?.id) {
      Alert.alert(
        'Choose a state',
        'Select the state this video belongs to before publishing.',
      );
      return;
    }

    const uploadOk = await actions.publish(targetState.id, description);
    if (uploadOk) {
      actions.clear();
      await queryClient.invalidateQueries({ queryKey: ['user_videos', user.id] });
      // The new upload changes the per-state upload counts and search
      // recommendations. Those are served by the ['search', ...] queries with a
      // long staleTime, so without this they'd keep showing pre-upload numbers
      // (e.g. "0 today" on the Choose-Your-State screen) until the cache went
      // stale. Marking them stale makes the next visit refetch the fresh counts;
      // the backend recomputes them a few seconds after the video finishes.
      queryClient.invalidateQueries({ queryKey: ['search'] });
      navigation.goBack();
      // @ts-expect-error
      navigation.navigate('Tabs', {
        screen: Tabs.TabProfile,
        params: {
          fromTabs: true,
        },
      });
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
        source={videoSource}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        volume={volume}
        repeat
        onLoad={() => actions.setIsPreviewReady(true)}
        onError={(e: any) => {
          const msg = e?.error?.errorString || e?.error?.code || 'Unknown playback error';
          console.error('[VideoPreview] Playback error:', e);
          Alert.alert('Video Playback Error', msg);
        }}
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
          <View className="w-4/5 items-center gap-3">
            <Text className="text-xl text-primary">Uploading...</Text>
            <View className="h-2 w-full overflow-hidden rounded-full bg-white/20">
              <View
                className="h-full rounded-full bg-blue3"
                style={{ width: `${uploadProgress}%` }}
              />
            </View>
            <Text className="text-sm text-primary">{uploadProgress}%</Text>
          </View>
        )}
      </View>

      <View
        className="absolute left-0 w-full px-16"
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          bottom: insets.bottom + (isAndroid ? 10 : 0),
          display: uploading ? 'none' : 'flex',
        }}
      >
        <TouchableOpacity
          onPress={openStatePicker}
          hitSlop={8}
          className="mb-3 flex-row items-center justify-center gap-2 self-center rounded-full bg-black/50 px-4 py-2"
        >
          {/* eslint-disable-next-line react-native/no-inline-styles */}
          <SvgIcon image="location" color={colors.white} style={{ width: 16, height: 16 }} />
          <Text className="text-sm font-semibold text-primary">
            {targetState ? `Posting to ${targetState.label}` : 'Choose a state'}
          </Text>
          <Text className="text-xs text-blue3">Change</Text>
        </TouchableOpacity>
        <View className="flex-row justify-between">
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
      </View>
    </>
  );
};
