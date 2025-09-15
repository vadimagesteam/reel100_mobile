import { FlatList } from 'react-native';
import { useEffect, useRef } from 'react';

export const useFlatListLayoutChangeScrollFix = <T>(
  flatListRef: React.RefObject<FlatList<T> | null>,
  activeItemIndex: number,
  currentContainerHeight: number,
) => {
  const prevDimensions = useRef(0);
  const finalFixTimerRef = useRef<number>(null);
  useEffect(() => {
    if (
      flatListRef.current &&
      activeItemIndex &&
      prevDimensions.current !== currentContainerHeight
    ) {
      const fixScrollPosition = () => {
        flatListRef.current?.scrollToOffset({
          offset: activeItemIndex * currentContainerHeight,
          animated: false,
        });
      };
      fixScrollPosition();

      if (finalFixTimerRef.current) {
        clearTimeout(finalFixTimerRef.current);
      }
      finalFixTimerRef.current = setTimeout(fixScrollPosition, 60) as unknown as number;
    }
    prevDimensions.current = currentContainerHeight;
    return () => clearTimeout(finalFixTimerRef.current as any);
  }, [currentContainerHeight, activeItemIndex, flatListRef]);
};
