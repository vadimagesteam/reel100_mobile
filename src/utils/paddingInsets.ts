import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const usePaddingInsets = (): number => {
    const insets = useSafeAreaInsets();
    return insets ? insets.top + 10 : 20;
};
