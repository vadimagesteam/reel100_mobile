import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';
import { isIOS } from '../../../../utils/platformChecker';
import { SvgIcon } from '../../../../components/UI';

const PreviewVideoScreen = () => {
    const navigation = useNavigation();
    const { params } = useRoute();

    return (
        <>
            <Video
                source={{ uri: params?.previewUri }}
                style={StyleSheet.absoluteFill}
                controls
                resizeMode="cover"
                volume={1.0}
                audioOutput="speaker"
                repeat
            />

            <TouchableOpacity style={[isIOS() ? styles.backArrowIOS : styles.backArrowAndroid]} onPress={() => {
                navigation.goBack();
            }}>
                <SvgIcon image="backArrow" />
            </TouchableOpacity>
        </>
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
        width: 35,
        height: 35,
        backgroundColor: 'rgba(134,131,130,255)',
        borderRadius: '80%',
    },
});

export default PreviewVideoScreen;
