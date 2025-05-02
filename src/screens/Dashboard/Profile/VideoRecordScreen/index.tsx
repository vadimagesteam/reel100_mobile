import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert, Pressable, Platform, NativeModules } from 'react-native';
import { PERMISSIONS, request, check, RESULTS, openSettings } from 'react-native-permissions';
import { Camera, useCameraDevice, useCameraDevices, CameraProps, CameraDevice } from 'react-native-vision-camera';
// import { CameraKitCamera } from 'react-native-camera-kit';
// import { activateAudioSession } from 'react-native-vision-camera/audio';
import { GestureDetector, Gesture, GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import RNFS from 'react-native-fs';
import { launchImageLibrary, Asset, ImageLibraryOptions } from 'react-native-image-picker';
import Video from 'react-native-video';
// import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Reanimated, { Extrapolation, interpolate, runOnJS, useAnimatedGestureHandler, useAnimatedProps, useSharedValue } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import { colors, positionHelpers } from '../../../../styles';
import CustomHeader from '../../../../components/navigator/CustomHeader';
import { BodyText } from '../../../../components/UI';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { isIOS } from '../../../../utils/platformChecker';
import { DASHBOARD_ROUTES } from '../../../../navigation/routes';

const { CustomAudioSessionManager } = NativeModules;

const MAX_DURATION = 100;

Reanimated.addWhitelistedNativeProps({ zoom: true });
const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);

const requestCameraAndMicrophone = async (): Promise<boolean> => {
    try {
        const cameraPermission = await request(
            Platform.select({
                ios: PERMISSIONS.IOS.CAMERA,
                android: PERMISSIONS.ANDROID.CAMERA,
            })!
        );

        const micPermission = await request(
            Platform.select({
                ios: PERMISSIONS.IOS.MICROPHONE,
                android: PERMISSIONS.ANDROID.RECORD_AUDIO,
            })!
        );

        if (cameraPermission === RESULTS.BLOCKED || micPermission === RESULTS.BLOCKED) {
            Alert.alert(
                'Permissions Blocked',
                'Please allow access to the camera and microphone from Settings',
                [
                    { text: 'Open Settings', onPress: openSettings },
                    { text: 'Cancel', style: 'cancel' },
                ]
            );
        }

        return cameraPermission === RESULTS.GRANTED && micPermission === RESULTS.GRANTED;
    } catch (error) {
        console.error('Permission error:', error);
        return false;
    }
};

const VideoRecordScreen = () => {
    const navigation = useNavigation();
    const camera = useRef<Camera>(null);
    // const device = useCameraDevice('back');
    const [isRecording, setIsRecording] = useState(false);
    const [isLongPressRecording, setIsLongPressRecording] = useState(false);
    const [timer, setTimer] = useState<number>(MAX_DURATION);
    const [previewUri, setPreviewUri] = useState<string | null>(null);
    // const [audioPath, setAudioPath] = useState(null);
    const [audioEnabled, setAudioEnabled] = useState(Platform.OS === 'ios' ? false : true);
    const zoom = useSharedValue(device?.neutralZoom ?? 1);
    const zoomOffset = useSharedValue(zoom.value);
    const [isCameraActive, setIsCameraActive] = useState(true);
    // const [devices, setDevices] = useState<CameraDevice | null>(null);
    const [availableDevices, setAvailableDevices] = useState<CameraDevice[]>([]);
    const [isFrontCamera, setIsFrontCamera] = useState(false);
    const [torchOn, setTorchOn] = useState(false);

    const frontCamera = availableDevices.find(d => d.position === 'front');
    const backCamera = availableDevices.find(d => d.position === 'back');
    const device = isFrontCamera ? frontCamera : backCamera;

    useFocusEffect(
        useCallback(() => {
            const init = async () => {
                const devices = await Camera.getAvailableCameraDevices();
                // const backCamera = devices.find((d) => d.position === 'back');
                // setDevices(backCamera ?? null);
                setAvailableDevices(devices);

                // await CustomAudioSessionManager.deactivateAudioSession(); // для iOS важливо
                await CustomAudioSessionManager.activateVideoRecordingAudioSession(); // для iOS важливо
                setAudioEnabled(true);
                setIsCameraActive(true);
                setPreviewUri(null);
            };

            init();

            return () => {
                setIsCameraActive(false);
                setAvailableDevices([]);
            };
        }, [])
    );

    useEffect(() => {
        const requestPermissions = async () => {
            const hasPermissions = await requestCameraAndMicrophone();
            if (!hasPermissions) {
                Alert.alert(
                    'Permissions needed',
                    'We need camera and microphone access to record videos.',
                    [{ text: 'OK' }]
                );
            }
        };

        requestPermissions();
    }, []);

    // useEffect(() => {
    //     if (isRecording) {
    //         // Затримка перед увімкненням аудіо
    //         setTimeout(() => {
    //             setAudioEnabled(true);
    //         }, 600);  // 1000 мс — змінити, якщо потрібно більше/менше часу
    //     } else {
    //         // Якщо запис завершений, вимикаємо аудіо
    //         setAudioEnabled(false);
    //     }
    // }, [isRecording]);


    // console.log('---- audioEnabled ---->', audioEnabled);

    // console.log('---isRecording--- AND --audioEnabled->', isRecording, audioEnabled);
    // useEffect(() => {
    //     const initializeCamera = async () => {
    //         try {
    //             console.log('Очікування готовності камери...');
    //             // Очікуємо, поки камера активується
    //             if (camera.current) {
    //                 console.log('Камера готова!');
    //                 await CustomAudioSessionManager.activateAudioSession();
    //             }
    //         } catch (err) {
    //             console.error('Помилка під час активації аудіо сесії:', err);
    //         }
    //     };

    //     initializeCamera();

    //     return () => {
    //         CustomAudioSessionManager.deactivateAudioSession();
    //     };
    // }, []);

    useEffect(() => {
        if (isRecording && timer > 0) {
            const interval = setInterval(() => {
                setTimer(t => t - 1);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isRecording, timer]);

    // Зупинка запису, коли timer = 0
    useEffect(() => {
        if (timer === 0 && isRecording) {
            stopRecording();
        }
    }, [timer, isRecording]);


    const startRecording = async () => {
        if (!camera.current || isRecording) { return; }
        await CustomAudioSessionManager.deactivateAudioSession();
        try {
            console.log('📸 Стартуємо запис...');
            // setIsRecording(true);


            if (Platform.OS === 'ios') {


                // await CustomAudioSessionManager.activateVideoRecordingAudioSession();
                setTimeout(async () => {
                    await CustomAudioSessionManager.activateVideoRecordingAudioSession();
                    // await CustomAudioSessionManager.deactivateAudioSession();
                    // інші налаштування
                }, 550);
            }


            // await new Promise((resolve) => setTimeout(resolve, 300));
            // setTimeout(async () => {
            //     try {
            //         await CustomAudioSessionManager.activateAudioSession();
            //         console.log('Аудіосесію активовано!');

            //     } catch (err) {
            //         console.error('Активація аудіосесії не вдалася:', err);

            //     }

            // }, 1000);
            // if (typeof RNAudioSessionManager.startAudioRecording === 'function') {
            //     await RNAudioSessionManager.startAudioRecording(audioFilePath);
            // setAudioEnabled(true);
            // } else {
            //     console.warn('Audio recording not available.');
            //     setAudioEnabled(false);
            // }
            // await RNAudioSessionManager.startAudioRecording();
            // setTimeout(async () => {
            setIsRecording(true);
            setTimer(MAX_DURATION);

            if (Platform.OS === 'ios') {
                setAudioEnabled(true);
            }
            await camera.current.startRecording({
                // fileType: 'mp4',
                // flash: 'off',
                onRecordingFinished: async (video) => {
                    // console.log('Recording finished:', video);
                    console.log('🎥 Отримане відео:', video);
                    setPreviewUri(video.path);
                    navigation.navigate(DASHBOARD_ROUTES.PREVIEW_VIDEO_SCREEN, { previewUri: video.path });
                    setIsRecording(false);
                    // setAudioEnabled(false);
                    if (Platform.OS === 'ios') {
                        await CustomAudioSessionManager.deactivateAudioSession();
                        setAudioEnabled(false);
                    }

                    // console.log('🛑 Зупиняємо аудіо запис...');
                    // const audioPath = await RNAudioSessionManager.stopAudioRecording();
                    // console.log('--- Audio saved at --->:', audioPath);
                    // console.log('✅ Аудіо запис зупинено.');

                    // const audioExists = await RNFS.exists(audioFilePath);
                    // if (!audioExists) {
                    //     console.warn('🎥 Аудіо файл не знайдено, показуємо тільки відео.');
                    //     setPreviewUri('file://' + video.path);
                    //     return;
                    // }
                    // const canMerge = await checkAudioFile(audioPath);
                    // if (!canMerge) {
                    //     console.log('🛑 Пропускаємо об\'єднання через проблеми з аудіо.');
                    //     return;
                    // }

                    // console.log('🛠 Об\'єднуємо відео та аудіо...');
                    // try {
                    //     const mergedPath = await VideoAudioMerger.mergeVideoAndAudio(
                    //         video.path.replace('file://', ''),
                    //         audioPath.replace('file://', '')
                    //     );
                    //     console.log('🎬 Отриманий mergedPath:', mergedPath);

                    //     if (mergedPath) {
                    //         console.log('✅ Об\'єднане відео збережено за шляхом:', mergedPath);
                    //         setPreviewUri('file://' + mergedPath);

                    //         // тільки після успішного об'єднання видаляємо оригінали
                    //         await RNFS.unlink(video.path.replace('file://', ''));
                    //         await RNFS.unlink(audioPath.replace('file://', ''));
                    //     } else {
                    //         console.warn('⚠️ Об\'єднання не вдалося, показуємо оригінальне відео.');
                    //         setPreviewUri(video.path);
                    //     }
                    // } catch (mergeError) {
                    //     console.error('❌ Помилка при об\'єднанні відео та аудіо:', mergeError);
                    //     setPreviewUri(video.path); // Показуємо тільки відео у разі помилки
                    // }

                },
                onRecordingError: async (error) => {
                    console.error('Recording error:', error);
                    setIsRecording(false);
                    if (Platform.OS === 'ios') {
                        await CustomAudioSessionManager.deactivateAudioSession();
                        setAudioEnabled(false);
                    }
                    // if (typeof RNAudioSessionManager.stopAudioRecording === 'function') {
                    //     await RNAudioSessionManager.stopAudioRecording();
                    // }
                },
            });

            // }, 500);

        } catch (err) {
            console.error('startRecording error:', err);
            setIsRecording(false);
            if (Platform.OS === 'ios') {
                setAudioEnabled(false);
                await CustomAudioSessionManager.deactivateAudioSession();
            }
        }
    };

    const stopRecording = async () => {
        if (!camera.current || !isRecording) {
            console.log('🛑 stopRecording: Recording already stopped.');
            return;
        }


        try {
            await camera.current.stopRecording();
            setIsRecording(false);
            setIsCameraActive(false);
            if (Platform.OS === 'ios') {
                setAudioEnabled(false);
                await CustomAudioSessionManager.deactivateAudioSession();
            }
        } catch (err) {
            console.error('stopRecording error:', err);
            setIsRecording(false);
            setIsCameraActive(false);
            if (Platform.OS === 'ios') {
                setAudioEnabled(false);
                await CustomAudioSessionManager.deactivateAudioSession(); // Якщо сталася помилка, деактивуємо аудіосесію
            }
        }
    };



    // const startAudioRecording = async () => {
    //     try {
    //         if (Platform.OS === 'ios') {
    //             await AVAudioSessionManager.activate();
    //         }
    //         const path = await audioRecorderPlayer.startRecorder();
    //         console.log('🔴 START Audio recording at:', path);
    //         setAudioPath(path);
    //     } catch (err) {
    //         console.error('Error starting audio recording:', err);
    //     }
    // };

    // const stopAudioRecording = async () => {
    //     try {
    //         const path = await audioRecorderPlayer.stopRecorder();
    //         audioRecorderPlayer.removeRecordBackListener();
    //         console.log('🛑 STOP Audio recorded at:', path);
    //         setAudioPath(path);
    //         if (Platform.OS === 'ios') {
    //             await AVAudioSessionManager.deactivate();
    //         }
    //     } catch (err) {
    //         console.error('Error stopping audio recording:', err);
    //     }
    // };

    // const playAudio = async () => {
    //     if (!audioPath) return;
    //     try {
    //         await audioRecorderPlayer.startPlayer(audioPath);
    //         audioRecorderPlayer.setVolume(1.0);
    //     } catch (err) {
    //         console.error('Error playing audio:', err);
    //     }
    // };

    // const resetCamera = async () => {
    //     console.log('🔄 Resetting camera...');
    //     setPreviewUri(null); // Прибрати прев’ю

    //     if (Platform.OS === 'ios') {
    //         await CustomAudioSessionManager.activateVideoRecordingAudioSession();
    //         setAudioEnabled(false);
    //     }

    //     const devices = await Camera.getAvailableCameraDevices();
    //     const backCamera = devices.find((d) => d.position === 'back');
    //     setDevice(backCamera ?? null);

    //     setIsCameraActive(true);
    // };

    const gestureHandler = useAnimatedGestureHandler({
        onStart: (_, ctx) => {
            ctx.startY = 0;
        },
        onActive: (event, ctx) => {
            const deltaY = event.translationY;
            const newZoom = Math.max(1, 1 - deltaY / 300); // Зум від 1 до ~3
            zoom.value = newZoom;
        },
        onEnd: (_, ctx) => {
            // Зупиняємо запис, якщо активне панорамування
            if (isLongPressRecording) {
                runOnJS(stopRecording)();
            }
        },
    });

    const handleLongPress = () => {
        setIsLongPressRecording(true);
        startRecording();
    };

    const handlePress = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    // Пан-жест для затиснутого запису (рух вгору/вниз)
    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            const delta = -e.translationY / 200;
            const newZoom = zoom.value + delta;
            zoom.value = interpolate(
                newZoom,
                [device.minZoom, device.maxZoom],
                [device.minZoom, device.maxZoom],
                Extrapolation.CLAMP
            );
        });
    // .onFinalize(() => {
    //     runOnJS(handlePanGestureRelease)();
    // });


    // Пінч-жест для масштабування при звичайному натисканні
    const pinchGesture = Gesture.Pinch()
        .onBegin(() => {
            zoomOffset.value = zoom.value;
        })
        .onUpdate((e) => {
            const newZoom = zoomOffset.value * e.scale;
            zoom.value = interpolate(
                newZoom,
                [1, 10],
                [device.minZoom, device.maxZoom],
                Extrapolation.CLAMP
            );
        });


    const gesture = Gesture.Simultaneous(pinchGesture, panGesture);

    const animatedProps = useAnimatedProps(() => ({
        zoom: zoom.value,
    }));

    const pickVideoFromGallery = () => {
        const options: ImageLibraryOptions = {
            mediaType: 'video',
            selectionLimit: 1,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
            } else if (response.errorCode) {
            } else if (response.assets && response.assets.length > 0) {
                const videoUri = response.assets[0].uri;
                navigation.navigate(DASHBOARD_ROUTES.PREVIEW_VIDEO_SCREEN, { previewUri: videoUri });
                console.log('✅ Вибране відео: ', videoUri);
            }
        });
    };

    if (!device) { return <Text />; }

    return (
        <GestureHandlerRootView style={positionHelpers.fill}>
            <GestureDetector gesture={gesture}>
                <ReanimatedCamera
                    ref={camera}
                    style={StyleSheet.absoluteFill}
                    device={device}
                    isActive={true}
                    video={true}
                    audio={true}
                    // audio={audioEnabled}
                    photo={true}
                    animatedProps={animatedProps}
                    torch={torchOn ? 'on' : 'off'}
                />
            </GestureDetector>

            <TouchableOpacity style={[isIOS() ? styles.closeIOS : styles.closeAndroid]} onPress={async () => {
                navigation.goBack();
                setPreviewUri(null);
                setIsCameraActive(false);
            }}>
                <BodyText fontSize={16} paddingTop={isIOS() ? 9 : 4} color={colors.white}>&#x2715;</BodyText>
            </TouchableOpacity>
            {isRecording && (
                <TouchableOpacity style={[styles.recodring]}>
                    <BodyText fontSize={14} >{timer}s</BodyText>
                </TouchableOpacity>)}

            <View style={styles.optionsContainer}>
                <TouchableOpacity style={[positionHelpers.center, styles.optionsButton]}
                    onPress={() => setIsFrontCamera(prev => !prev)}
                >
                    <BodyText fontSize={10} >icon 1</BodyText>
                </TouchableOpacity>
                <TouchableOpacity style={[positionHelpers.center, styles.optionsButton]}
                    onPress={() => setTorchOn(prev => !prev)}>
                    <BodyText fontSize={10}>{torchOn ? 'icon 2' : '2 icon'}</BodyText>
                </TouchableOpacity>
                <TouchableOpacity style={[positionHelpers.center, styles.optionsButton]}
                    onPress={pickVideoFromGallery}>
                    <BodyText fontSize={10} >icon 3</BodyText>
                </TouchableOpacity>
                {/* <TouchableOpacity style={{
                    width: 35,
                    height: 35,
                    backgroundColor: 'rgba(134,131,130,255)',
                    borderRadius: 999,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <BodyText fontSize={10} >icon 4</BodyText>
                </TouchableOpacity> */}
            </View>

            <View style={styles.controls}>
                <PanGestureHandler onGestureEvent={gestureHandler}>
                    <Animated.View>
                        <View style={[styles.recordButtonOuter, isRecording && styles.recordingOuter]}>
                            <Pressable
                                onPress={handlePress}
                                onLongPress={handleLongPress}
                                style={[styles.recordButton, isRecording && styles.recordButtonInner]}
                            />
                        </View>
                    </Animated.View>
                </PanGestureHandler>
            </View>
        </GestureHandlerRootView >
    );
};

const styles = StyleSheet.create({
    controls: {
        position: 'absolute',
        bottom: 40,
        alignSelf: 'center',
        alignItems: 'center',
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
        transform: [{ scale: 0.9 }],
    },
    uploadButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 25,
    },
    buttonText: {
        fontWeight: 'bold',
        color: '#000',
    },
    recodring: {
        position: 'absolute',
        top: 70,
        alignSelf: 'center',
        alignItems: 'center',
        gap: 16,
        paddingHorizontal: 12,
        paddingVertical: 0.5,
        backgroundColor: colors.red1,
        borderRadius: 4,
    },
    recordingAndroid: {
        position: 'absolute',
        top: 70,
        alignSelf: 'center',
        alignItems: 'center',
        gap: 16,
        paddingHorizontal: 12,
        paddingVertical: 0.5,
        backgroundColor: colors.red1,
        borderRadius: 4,
    },
    closeIOS: {
        position: 'absolute',
        left: 20,
        top: 50,
        alignItems: 'center',
        width: 35,
        height: 35,
        backgroundColor: 'rgba(134,131,130,255)',
        borderRadius: '80%',
    },
    closeAndroid: {
        position: 'absolute',
        left: 20,
        top: 20,
        alignItems: 'center',
        width: 35,
        height: 35,
        backgroundColor: 'rgba(134,131,130,255)',
        borderRadius: '80%',
    },
    recordButton: {
        position: 'absolute',
        alignSelf: 'center',
        width: 65,
        height: 65,
        borderRadius: 35,
        backgroundColor: 'red',
    },
    optionsContainer: {
        position: 'absolute',
        top: '25%',
        right: 20,
        transform: [{ translateY: -((35 * 4 + 16 * 3) / 2) }], // 4 кнопки по 35 + 3 відступи по 16
        gap: 16,
    },
    optionsButton: {
        width: 35,
        height: 35,
        backgroundColor: 'rgba(134,131,130,255)',
        borderRadius: 999,
    },
});

export default VideoRecordScreen;

/// NEED !!!!

{/* <TouchableOpacity style={{
                position: 'absolute',
                // bottom: 50,
                left: 20,
                top: 20,
                // alignSelf: 'center',
                alignItems: 'center',
                // justifyContent: 'center',
                // gap: 16,
                width: 35,
                height: 35,
                // padding: 20,
                backgroundColor: 'rgba(134,131,130,255)',
                // opacity: 0.4,
                borderRadius: '80%',
            }} onPress={() => navigation.goBack()}>
                <BodyText fontSize={16} paddingTop={4} color={colors.white}>&#x2715;</BodyText>
            </TouchableOpacity>

            {isRecording && (
                <TouchableOpacity style={{
                    position: 'absolute',
                    // bottom: 50,
                    // left: 20,
                    top: 40,
                    alignSelf: 'center',
                    alignItems: 'center',
                    // justifyContent: 'center',
                    gap: 16,
                    // width: 35,
                    // height: 35,
                    paddingHorizontal: 12,
                    paddingVertical: 0.5,
                    // padding: 20,
                    backgroundColor: colors.red1,
                    // opacity: 0.4,
                    borderRadius: 4,
                }}>
                    <BodyText fontSize={14} >{timer}s</BodyText>
                </TouchableOpacity>)}

            <TouchableOpacity style={{
                position: 'absolute',
                // bottom: 50,
                // left: 20,
                top: 40,
                right: 20,
                // alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
                // width: 35,
                // height: 35,
                // paddingHorizontal: 12,
                // paddingVertical: 0.5,
                // padding: 20,
                width: 35,
                height: 35,
                // padding: 20,
                backgroundColor: 'rgba(134,131,130,255)',
                // opacity: 0.4,
                borderRadius: '80%',
            }}>
                <BodyText fontSize={10} >icon 1</BodyText>
            </TouchableOpacity>

            <TouchableOpacity style={{
                position: 'absolute',
                // bottom: 50,
                // left: 20,
                top: 40 * 2 + 5,
                right: 20,
                // alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
                // width: 35,
                // height: 35,
                // paddingHorizontal: 12,
                // paddingVertical: 0.5,
                // padding: 20,
                width: 35,
                height: 35,
                // padding: 20,
                backgroundColor: 'rgba(134,131,130,255)',
                // opacity: 0.4,
                borderRadius: '80%',
            }}>
                <BodyText fontSize={10} >icon 2</BodyText>
            </TouchableOpacity>
            <TouchableOpacity style={{
                position: 'absolute',
                // bottom: 50,
                // left: 20,
                top: 40 * 3 + 10,
                right: 20,
                // alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
                // width: 35,
                // height: 35,
                // paddingHorizontal: 12,
                // paddingVertical: 0.5,
                // padding: 20,
                width: 35,
                height: 35,
                // padding: 20,
                backgroundColor: 'rgba(134,131,130,255)',
                // opacity: 0.4,
                borderRadius: '80%',
            }}>
                <BodyText fontSize={10} >icon 3</BodyText>
            </TouchableOpacity>
            <TouchableOpacity style={{
                position: 'absolute',
                // bottom: 50,
                // left: 20,
                top: 40 * 4 + 15,
                right: 20,
                // alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
                // width: 35,
                // height: 35,
                // paddingHorizontal: 12,
                // paddingVertical: 0.5,
                // padding: 20,
                width: 35,
                height: 35,
                // padding: 20,
                backgroundColor: 'rgba(134,131,130,255)',
                // opacity: 0.4,
                borderRadius: '80%',
            }}>
                <BodyText fontSize={10} >icon 4</BodyText>
            </TouchableOpacity> */}
//////

