import { useAnimatedStyle, SharedValue } from 'react-native-reanimated';

export const useHeartAnimatedStyle = (
    tapX: SharedValue<number>,
    tapY: SharedValue<number>,
    scale: SharedValue<number>,
    opacity: SharedValue<number>
) => {
    return useAnimatedStyle(() => ({
        left: tapX.value - 40,
        top: tapY.value - 40,
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
    }));
};
