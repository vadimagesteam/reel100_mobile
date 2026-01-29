import React, { useEffect, useMemo, useState } from 'react';
import { Platform, ScrollView, Text, View, NativeModules } from 'react-native';
import { CameraDevice, CameraDeviceFormat } from 'react-native-vision-camera';

// Enable/disable debug overlay globally
export const CAMERA_DEBUG_ENABLED = __DEV__ || true; // Set to false to disable in production

const { CameraDebugModule } = NativeModules;

// Debug version for tracking builds
const DEBUG_VERSION = 'v10-b76';

interface DeviceInfo {
  name: string;
  model: string;
  systemName: string;
  systemVersion: string;
  modelIdentifier: string;
  modelName: string;
}

interface CameraInfo {
  name: string;
  position: string;
  deviceType: string;
  activeFormatWidth: number;
  activeFormatHeight: number;
  activeFormatPixelFormat: string;
  activeFormatPixelFormatReadable: string;
  supportsHDR: boolean;
  availablePixelFormats: string[];
  formatCount: number;
}

interface NativeCameraDebugInfo {
  cameras: CameraInfo[];
  lastRecordingDebugInfo: Record<string, unknown>;
  lastError: string;
}

interface CameraDebugOverlayProps {
  device: CameraDevice | undefined;
  format: CameraDeviceFormat | null | undefined;
  fps: number;
  isRecording: boolean;
  cameraPosition: 'front' | 'back';
}

export const CameraDebugOverlay: React.FC<CameraDebugOverlayProps> = ({
  device,
  format,
  fps,
  isRecording,
  cameraPosition,
}) => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [nativeCameraInfo, setNativeCameraInfo] = useState<NativeCameraDebugInfo | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const [deviceError, setDeviceError] = useState<string | null>(null);

  // Fetch native device info on mount
  useEffect(() => {
    if (Platform.OS === 'ios' && CameraDebugModule) {
      CameraDebugModule.getDeviceInfo()
        .then((info: DeviceInfo) => {
          setDeviceInfo(info);
          setDeviceError(null);
        })
        .catch((err: Error) => {
          console.log('Failed to get device info:', err);
          setDeviceError(err.message || 'Unknown error');
        });
    } else {
      setDeviceError('CameraDebugModule not available');
    }
  }, []);

  // Fetch native camera info periodically
  useEffect(() => {
    const fetchCameraInfo = () => {
      if (Platform.OS === 'ios' && CameraDebugModule) {
        CameraDebugModule.getCameraDebugInfo()
          .then((info: NativeCameraDebugInfo) => setNativeCameraInfo(info))
          .catch((err: Error) => console.log('Failed to get camera info:', err));
      }
    };

    fetchCameraInfo();

    const interval = setInterval(() => {
      fetchCameraInfo();
      setRefreshCount((c) => c + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, [isRecording]);

  const formatInfo = useMemo(() => {
    if (!format) return null;

    return {
      resolution: `${format.videoWidth}x${format.videoHeight}`,
      photoResolution: `${format.photoWidth}x${format.photoHeight}`,
      maxFps: format.maxFps,
      minFps: format.minFps,
      supportsVideoHdr: format.supportsVideoHdr,
      supportsPhotoHdr: format.supportsPhotoHdr,
      fieldOfView: format.fieldOfView,
    };
  }, [format]);

  const activeNativeCamera = useMemo(() => {
    if (!nativeCameraInfo?.cameras) return null;
    const position = cameraPosition === 'front' ? 'front' : 'back';
    return nativeCameraInfo.cameras.find((c) => c.position === position);
  }, [nativeCameraInfo, cameraPosition]);

  if (!CAMERA_DEBUG_ENABLED) return null;

  return (
    <View className="absolute left-2 right-2 top-20 z-50">
      <ScrollView
        className="max-h-[450px] rounded-lg bg-black p-3"
        showsVerticalScrollIndicator={true}
      >
        {/* Title */}
        <Text style={{ color: '#FFFF00', fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>
          DEBUG {DEBUG_VERSION} #{refreshCount}
        </Text>

        {/* Device Info */}
        <Text style={{ color: '#FF0000', fontSize: 12, fontWeight: 'bold' }}>DEVICE:</Text>
        {deviceInfo ? (
          <>
            <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' }}>
              {deviceInfo.modelName} ({deviceInfo.modelIdentifier})
            </Text>
            <Text style={{ color: '#FFFFFF', fontSize: 12 }}>
              {deviceInfo.systemName} {deviceInfo.systemVersion}
            </Text>
          </>
        ) : (
          <Text style={{ color: '#FF6666', fontSize: 12 }}>
            {deviceError || 'Loading...'}
          </Text>
        )}

        {/* Status */}
        <Text style={{ color: '#FF0000', fontSize: 12, fontWeight: 'bold', marginTop: 8 }}>
          STATUS:
        </Text>
        <Text style={{ color: isRecording ? '#FF0000' : '#FFFFFF', fontSize: 14, fontWeight: 'bold' }}>
          {isRecording ? '● REC' : '○ Ready'} | {cameraPosition.toUpperCase()}
        </Text>

        {/* JS Format */}
        {formatInfo && (
          <>
            <Text style={{ color: '#FF0000', fontSize: 12, fontWeight: 'bold', marginTop: 8 }}>
              JS FORMAT:
            </Text>
            <Text style={{ color: '#FFFFFF', fontSize: 12 }}>
              {formatInfo.resolution} @ {fps}fps | HDR: {formatInfo.supportsVideoHdr ? 'YES' : 'NO'}
            </Text>
          </>
        )}

        {/* Native Camera Format */}
        {activeNativeCamera && (
          <>
            <Text style={{ color: '#FF0000', fontSize: 12, fontWeight: 'bold', marginTop: 8 }}>
              NATIVE FORMAT:
            </Text>
            <Text style={{ color: '#FFFF00', fontSize: 14, fontWeight: 'bold' }}>
              {activeNativeCamera.activeFormatPixelFormat}
            </Text>
            <Text style={{ color: '#FFFFFF', fontSize: 12 }}>
              = {activeNativeCamera.activeFormatPixelFormatReadable}
            </Text>
            <Text style={{ color: '#FFFFFF', fontSize: 12 }}>
              {activeNativeCamera.activeFormatWidth}x{activeNativeCamera.activeFormatHeight} | HDR: {activeNativeCamera.supportsHDR ? 'YES' : 'NO'}
            </Text>
          </>
        )}

        {/* Recording Debug - Most Important */}
        <Text style={{ color: '#FFFF00', fontSize: 12, fontWeight: 'bold', marginTop: 10 }}>
          === RECORDING DEBUG ===
        </Text>
        {nativeCameraInfo?.lastRecordingDebugInfo &&
        Object.keys(nativeCameraInfo.lastRecordingDebugInfo).length > 0 ? (
          Object.entries(nativeCameraInfo.lastRecordingDebugInfo).map(([key, value]) => (
            <Text key={key} style={{ color: '#FFFFFF', fontSize: 11 }}>
              {key}: {String(value)}
            </Text>
          ))
        ) : (
          <Text style={{ color: '#FF6666', fontSize: 11 }}>
            Start recording to see debug data
          </Text>
        )}

        {/* Available Formats */}
        {activeNativeCamera && activeNativeCamera.availablePixelFormats?.length > 0 && (
          <>
            <Text style={{ color: '#FF0000', fontSize: 11, fontWeight: 'bold', marginTop: 8 }}>
              AVAILABLE FORMATS ({activeNativeCamera.availablePixelFormats.length}):
            </Text>
            <Text style={{ color: '#AAAAAA', fontSize: 10 }}>
              {activeNativeCamera.availablePixelFormats.join(', ')}
            </Text>
          </>
        )}

        {/* Error */}
        {nativeCameraInfo?.lastError ? (
          <>
            <Text style={{ color: '#FF0000', fontSize: 12, fontWeight: 'bold', marginTop: 8 }}>
              LAST ERROR:
            </Text>
            <Text style={{ color: '#FF6666', fontSize: 11 }}>
              {nativeCameraInfo.lastError}
            </Text>
          </>
        ) : null}

        {/* Build 76 Strategy */}
        <Text style={{ color: '#888888', fontSize: 10, marginTop: 10 }}>
          B76: Filter Bayer formats at config level
        </Text>
      </ScrollView>
    </View>
  );
};
