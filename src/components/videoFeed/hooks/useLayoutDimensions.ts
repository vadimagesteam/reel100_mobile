import { useCallback, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';


export const useLayoutDimensions = () => {
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0,  height: 0 });

  const onLayout = useCallback((e: LayoutChangeEvent) => setDimensions({
    height: e.nativeEvent.layout.height,
    width: e.nativeEvent.layout.width,
  }), [setDimensions]);

  return { dimensions, onLayout };
};
