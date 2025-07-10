import { View } from 'react-native';
import { VideoRecording } from '../../../components/videoRecording/VideoRecording.tsx';

export const VideoRecordingScreen = () => {
  return (
    <View className="bg-background flex-1">
      <VideoRecording />
    </View>
  );
};
