import { Text, View } from 'react-native';
import { SvgIcon } from '../../ui';
import { UseCameraFeatures } from './hooks/useCameraFeatures';
import { useAnimatedStyle, withDelay, withTiming } from 'react-native-reanimated';
import { ControlButton } from './ControlButton';

export interface CameraFeaturesProps {
  isRecording: boolean;
  features: UseCameraFeatures;
  onPickFromGallery: () => void;
}

export const CameraFeatures = ({
  features,
  onPickFromGallery,
  isRecording,
}: CameraFeaturesProps) => {
  const { frameRate, setFrameRate, cameraPosition, setCameraPosition, torchOn, setTorchOn } =
    features;
  const animStyle = useAnimatedStyle(() => ({
    opacity: isRecording ? withTiming(0, { duration: 200 }) : withDelay(500, withTiming(1)),
  }));

  return (
    <View className="absolute right-[20px] top-[220px] gap-[16px]">
      <ControlButton
        onPress={() => {
          setTorchOn(false);
          setCameraPosition((prev) => (prev === 'back' ? 'front' : 'back'));
        }}
      >
        <SvgIcon image="switchCameraIcon" />
      </ControlButton>

      <ControlButton
        disabled={cameraPosition === 'front'}
        onPress={() => {
          setTorchOn((prev) => !prev);
        }}
      >
        <SvgIcon image={torchOn ? 'flashIcon' : 'flashNoIcon'} />
      </ControlButton>

      <ControlButton
        animated
        style={animStyle}
        onPress={() => {
          setFrameRate((prev) => (prev === 30 ? 60 : 30));
        }}
      >
        <Text className="text-[10px] text-white">{frameRate}</Text>
        <Text className="text-[10px] text-white">FPS</Text>
      </ControlButton>
      <ControlButton animated style={animStyle} onPress={onPickFromGallery}>
        <SvgIcon image="gellaryCameraIcon" />
      </ControlButton>
    </View>
  );
};
