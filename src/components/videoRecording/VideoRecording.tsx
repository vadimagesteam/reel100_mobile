import React, { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Camera, CameraProps, useCameraDevice } from 'react-native-vision-camera';
import Reanimated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedProps,
  useSharedValue,
} from 'react-native-reanimated';
import { CameraFeatures, Timer, useCameraFeatures, CloseButton, RecordButton } from './controls';
import { useNavigation } from '@react-navigation/native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { ImageLibraryOptions, launchImageLibrary } from 'react-native-image-picker';
import { VideoPreview } from './VideoPreview';
import { useVideoRecordStore } from './videoRecordStore';
import { PermissionsResult, requestCameraAndMicrophone } from './requestCameraAndMicrophone';

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
const MaxDurationSeconds = 100;

export const VideoRecording = () => {
  const navigation = useNavigation();
  const cameraRef = useRef<Camera>(null);
  const cameraFeatures = useCameraFeatures();
  const [isRecording, setIsRecording] = useState(false);
  const [permissions, setPermissions] = useState<Omit<PermissionsResult, 'allGranted'>>({
    microphone: false,
    camera: false,
  });

  const { cameraPosition, torchOn } = cameraFeatures;

  const {
    uploading,
    previewUri,
    isPreviewReady,
    actions: { clear, setPreviewUri },
  } = useVideoRecordStore();

  const activeDevice = useCameraDevice(cameraPosition);

  // todo: move to a separated screen like normal people do :)
  useEffect(() => {
    const requestPermissions = async () => {
      const { allGranted, camera, microphone } = await requestCameraAndMicrophone();
      if (!allGranted) {
        Alert.alert(
          'Permissions needed',
          'We need camera and microphone access to record videos.',
          [{ text: 'OK' }],
        );
      }
      setPermissions({ camera, microphone });
    };
    requestPermissions();
  }, []);

  const onPickFromGallery = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'video',
      selectionLimit: 1,
    };
    await launchImageLibrary(options, (response) => {
      if (response.errorCode) {
        Alert.alert(`Error #${response.errorCode}: ${response.errorMessage ?? 'Unknown error'}`);
      }
      if (response.assets && response.assets.length > 0) {
        const videoUri = response.assets[0].uri;
        if (videoUri) {
          setPreviewUri(videoUri);
        }
      }
    });
  };

  const handleStartRecording = async () => {
    setIsRecording(true);

    // https://github.com/mrousavy/react-native-vision-camera/issues/3524
    // !! SOUND RECORDING ISSUE:
    // If there is no sound, ensure all <Video> from react-native-video have disableAudioSessionManagement
    cameraRef.current?.startRecording({
      onRecordingFinished: (video) => {
        console.log('[onRecordingFinished]', video);
        setPreviewUri(video.path);
      },
      onRecordingError: (error) => {
        console.log('[onRecordingError]', error);
      },
    });
  };

  const handleFinishRecording = async () => {
    await cameraRef.current?.stopRecording();
    // Emulators debug
    // if (!cameraRef.current) {
    //   setPreviewUri(
    //     'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    //   );
    // }
    setIsRecording(false);
  };

  const handleCloseCamera = () => {
    clear();
    if (!previewUri) {
      navigation.goBack();
    }
  };

  const zoom = useSharedValue(activeDevice?.neutralZoom ?? 1);
  const zoomOffset = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
    .enabled(!!activeDevice)
    .onBegin(() => {
      zoomOffset.value = zoom.value;
    })
    .onUpdate((event) => {
      const targetZoom = zoomOffset.value * event.scale;
      zoom.value = interpolate(
        targetZoom,
        [1, 10],
        [activeDevice!.minZoom, 16],
        Extrapolation.CLAMP,
      );
    });

  const toggleCameraPosition = () => {
    cameraFeatures.setCameraPosition((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      runOnJS(toggleCameraPosition)();
    });

  const cameraGesture = Gesture.Exclusive(pinchGesture, doubleTapGesture);

  const animatedProps = useAnimatedProps<CameraProps>(() => ({ zoom: zoom.value }), [zoom]);

  return (
    <View className="flex-1 bg-background">
      {previewUri && <VideoPreview />}
      {!isPreviewReady && (
        <>
          {activeDevice && (
            <GestureDetector gesture={cameraGesture}>
              <ReanimatedCamera
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                device={activeDevice}
                isActive
                video={permissions.camera}
                photo={permissions.camera}
                audio={permissions.microphone}
                animatedProps={animatedProps}
                torch={torchOn ? 'on' : 'off'}
              />
            </GestureDetector>
          )}
          <CameraFeatures
            isRecording={isRecording}
            features={cameraFeatures}
            onPickFromGallery={onPickFromGallery}
          />
          <Timer
            active={isRecording}
            onTimeOut={handleFinishRecording}
            maxDurationSeconds={MaxDurationSeconds}
          />
          <RecordButton
            onStart={handleStartRecording}
            onStop={handleFinishRecording}
            isRecording={isRecording}
            maxDurationSeconds={MaxDurationSeconds}
            zoom={zoom}
          />
        </>
      )}
      {!uploading && !isRecording && <CloseButton onPress={handleCloseCamera} />}
    </View>
  );
};
