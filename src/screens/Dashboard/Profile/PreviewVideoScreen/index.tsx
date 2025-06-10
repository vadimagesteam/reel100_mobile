import React, {useEffect, useRef, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  NativeModules,
  View,
  Alert,
} from 'react-native';
import Video from 'react-native-video';
import {Camera} from 'react-native-vision-camera';
import {isIOS} from '../../../../utils/platformChecker';
import {BodyText, ButtonDefault, SvgIcon} from '../../../../components/UI';
import {colors, positionHelpers} from '../../../../styles';
import ButtonGradient from '../../../../components/ButtonGradient';
import {useReduxDispatch, useReduxSelector} from '../../../../store/store';
import {createVideoAction} from '../../../../redux/CameraRedux/cameraActions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {CustomAudioSessionManager} = NativeModules;

const PreviewVideoScreen = () => {
  const navigation = useNavigation();
  // const route = useRoute();
  const dispatch = useReduxDispatch();
  const {customLoading, prewievVideoUrl} = useReduxSelector(
    state => state.camera,
  );
  const [state, setState] = useState<string | null>(null); // add state
  const videoRef = useRef();
  const [duration, setDuration] = useState<number | null>(null);
  // const { previewUri } = route.params as { previewUri: string };

  // Load state from AsyncStorage
  useEffect(() => {
    const loadState = async () => {
      const stateValue = await AsyncStorage.getItem('STATE');
      setState(stateValue);
    };
    loadState();
  }, []);

  const handleLoad = meta => {
    setDuration(meta.duration);
    if (meta.duration > 100) {
      Alert.alert('The video must be no longer than 100 seconds.');
      navigation.goBack(); // або інша логіка
    }
  };

  // console.log('previewUri-->', prewievVideoUrl.split('/').pop()?.replace(/\.[^/.]+$/, ''));

  const publishVideoCallback = () => {
    const dataCreateVideo = {
      createVideo: {
        label: prewievVideoUrl
          .split('/')
          .pop()
          ?.replace(/\.[^/.]+$/, ''),
        states: {
          connect: {
            id: state,
          },
        },
      },
      file: prewievVideoUrl,
      navigation: navigation,
    };
    dispatch(createVideoAction(dataCreateVideo));
  };

  return (
    <>
      {prewievVideoUrl ? (
        <Video
          ref={videoRef}
          source={{uri: prewievVideoUrl}}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          volume={1.0}
          // audioOutput="speaker"
          repeat
          onLoad={handleLoad}
        />
      ) : null}

      <TouchableOpacity
        style={[isIOS() ? styles.backArrowIOS : styles.backArrowAndroid]}
        onPress={async () => {
          navigation.goBack();
          if (Platform.OS === 'ios') {
            // const devices = await Camera.getAvailableCameraDevices();
            // const backCamera = devices.find((d) => d.position === 'back');
            // await CustomAudioSessionManager.deactivateAudioSession(); // для iOS важливо
            // setAudioEnabled(true);
            // setIsCameraActive(true);
            // setPreviewUri(null);
          }
        }}>
        <SvgIcon image="backArrow" />
      </TouchableOpacity>

      <View style={[styles.controls, {left: 20}]}>
        {/* <ButtonGradient buttonStyles={{ minWidth: '40%', padding: 30, borderRadius: 10, marginBottom: 0, paddingTop: 0 }} title="Publish now" onPress={() => true} /> */}
        <ButtonDefault
          loading={customLoading}
          disabled={customLoading}
          buttoStyles={{
            minWidth: '30%',
            height: 50,
            borderRadius: 10,
            backgroundColor: colors.blue,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => publishVideoCallback()}>
          <BodyText fontWeight={'bold'} color={colors.white}>
            {'Publish now'}
          </BodyText>
        </ButtonDefault>
      </View>
      <View style={[styles.controls, {right: 20}]}>
        <ButtonDefault
          buttoStyles={{
            minWidth: '30%',
            height: 50,
            borderRadius: 10,
            backgroundColor: 'silver',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => true}>
          <BodyText fontWeight={'bold'}>{'Save draft'}</BodyText>
        </ButtonDefault>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  controlsPublish: {
    position: 'absolute',
    bottom: 1,
    gap: 16,
  },
  controls: {
    position: 'absolute',
    bottom: isIOS() ? 25 : 15,
    gap: 16,
  },
  timer: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
  },
  recordButtonOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff60',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'red',
  },
  recordingOuter: {
    backgroundColor: '#ffffff90',
  },
  recordingInner: {
    backgroundColor: '#ff4444',
    transform: [{scale: 0.9}],
  },
  uploadButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    bottom: 40,
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    gap: 16,
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#000',
  },
  backArrowIOS: {
    position: 'absolute',
    left: 20,
    top: 50,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: 35,
    height: 35,
    backgroundColor: 'rgba(134,131,130,255)',
    borderRadius: '80%',
  },
  backArrowAndroid: {
    position: 'absolute',
    left: 20,
    top: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 35,
    height: 35,
    backgroundColor: 'rgba(134,131,130,255)',
    borderRadius: '80%',
  },
});

export default PreviewVideoScreen;
