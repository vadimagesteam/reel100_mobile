import { View } from 'react-native';
import { VideoRecording } from '../../../components/VideoRecording/VideoRecording.tsx';

export const VideoRecordingScreen = () => {
  return (
    <View className="flex-1 bg-black4">
      <VideoRecording />
    </View>
  );
};
