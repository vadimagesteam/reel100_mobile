import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { BlurView } from '@react-native-community/blur';
import { cssInterop } from 'nativewind';
import FastImage from 'react-native-fast-image';

// BottomSheet: TouchableOpacity
cssInterop(TouchableOpacity, {
  className: 'style',
});

cssInterop(FastImage, {
  className: 'style',
});

cssInterop(BlurView, {
  className: 'style',
});
