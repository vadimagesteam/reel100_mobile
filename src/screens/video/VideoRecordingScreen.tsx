import { View } from 'react-native';
import { VideoRecording } from '../../components/videoRecording/VideoRecording';

export const VideoRecordingScreen = () => {
  return (
    <View className="flex-1 bg-background">
      <VideoRecording />
    </View>
  );
};
