import React, { useRef, useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Platform, StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import Video from 'react-native-video';
import { isIOS } from '../../../../utils/platformChecker';
import { BodyText, ButtonDefault, SvgIcon } from '../../../../components/old/UI';
import { colors } from '../../../../styles';
import { useReduxDispatch, useReduxSelector } from '../../../../store/store';
import { createVideoAction } from '../../../../redux/CameraRedux/cameraActions';
import { useStateSelector } from '../../../../state/app/uiStore.ts';

const PreviewVideoScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useReduxDispatch();
  const { customLoading, prewievVideoUrl } = useReduxSelector((state) => state.camera);

  const videoRef = useRef<Video>(null);
  const [duration, setDuration] = useState<number | null>(null);
  // const [stateId, setStateId] = useState<string | null>(null);
  const [selectedState] = useStateSelector();

  console.log('selectedState', selectedState);

  // Handle video load and duration check
  const handleLoad = useCallback(
    (meta: { duration: number }) => {
      setDuration(meta.duration);
      if (meta.duration > 100) {
        Alert.alert('The video must be no longer than 100 seconds.');
        navigation.goBack();
      }
    },
    [navigation],
  );

  // Publish button handler
  const handlePublish = useCallback(() => {
    if (!selectedState?.id) {
      alert('State is not selected');
      return;
    }
    const fileName = prewievVideoUrl
      .split('/')
      .pop()
      ?.replace(/\.[^/.]+$/, '');
    const payload = {
      createVideo: {
        label: fileName,
        states: {
          connect: { id: selectedState?.id },
        },
      },
      file: prewievVideoUrl,
      navigation,
    };
    dispatch(createVideoAction(payload));
  }, [dispatch, selectedState, prewievVideoUrl, navigation]);

  // Back button handler
  const handleBack = useCallback(async () => {
    navigation.goBack();
    if (Platform.OS === 'ios') {
      // Optionally handle iOS-specific camera/audio cleanup here.
      // await CustomAudioSessionManager.deactivateAudioSession();
    }
  }, [navigation]);

  return (
    <>
      {prewievVideoUrl && (
        <Video
          ref={videoRef}
          source={{ uri: prewievVideoUrl }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          volume={1.0}
          repeat
          onLoad={handleLoad}
        />
      )}

      {/* Back Arrow */}
      <TouchableOpacity
        style={isIOS() ? styles.backArrowIOS : styles.backArrowAndroid}
        onPress={handleBack}
        hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
      >
        <SvgIcon image="backArrow" />
      </TouchableOpacity>

      {/* Publish Button */}
      <View style={[styles.controls, { left: 20 }]}>
        <ButtonDefault
          loading={customLoading}
          disabled={customLoading}
          buttoStyles={styles.publishButton}
          onPress={handlePublish}
        >
          <BodyText fontWeight="bold" color={colors.white}>
            Publish now
          </BodyText>
        </ButtonDefault>
      </View>

      {/* Save Draft Button */}
      <View style={[styles.controls, { right: 20 }]}>
        <ButtonDefault
          buttoStyles={styles.draftButton}
          onPress={() => {
            // Save draft handler (implement as needed)
          }}
        >
          <BodyText fontWeight="bold">Save draft</BodyText>
        </ButtonDefault>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  controls: {
    position: 'absolute',
    bottom: isIOS() ? 25 : 15,
    gap: 16,
  },
  publishButton: {
    minWidth: '30%',
    height: 50,
    borderRadius: 10,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  draftButton: {
    minWidth: '30%',
    height: 50,
    borderRadius: 10,
    backgroundColor: 'silver',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrowIOS: {
    position: 'absolute',
    left: 20,
    top: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: 35,
    height: 35,
    backgroundColor: 'rgba(134,131,130,1)',
    borderRadius: 18,
  },
  backArrowAndroid: {
    position: 'absolute',
    left: 20,
    top: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 35,
    height: 35,
    backgroundColor: 'rgba(134,131,130,1)',
    borderRadius: 18,
  },
});

export default PreviewVideoScreen;
