import FastImage from 'react-native-fast-image';
import { View, ViewProps, Text, PixelRatio } from 'react-native';
import { useEffect, useMemo, useState } from 'react';

export interface AvatarProps extends ViewProps {
  uri?: string;
  name: string;
  size?: number;
}

export const Avatar = ({ uri, size = 60, name }: AvatarProps) => {
  const [showFallback, setShowFallback] = useState(!uri);

  useEffect(() => {
    setShowFallback(!uri);
  }, [uri]);

  const fontSize = PixelRatio.roundToNearestPixel(size / 2.5);

  const sizeStyle = useMemo(() => ({ width: size, height: size }), [size]);

  const emptyBgStyle = useMemo(() => {
    if (showFallback) {
      return { backgroundColor: getStringColor(name) };
    }
    return {};
  }, [showFallback, name]);

  const textStyle = useMemo(() => {
    return {
      fontFamily: 'System',
      fontSize: fontSize,
      includeFontPadding: false,
    };
  }, [fontSize]);

  const initials = useMemo(() => getInitials(name), [name]);

  if (showFallback) {
    return (
      <View className="items-center justify-center rounded-full" style={[sizeStyle, emptyBgStyle]}>
        <Text className="text-white" style={textStyle}>
          {initials}
        </Text>
      </View>
    );
  }

  return (
    <FastImage
      source={{ uri: uri }}
      className="rounded-full"
      style={sizeStyle}
      onError={() => setShowFallback(true)}
    />
  );
};

function getStringColor(string: string): string {
  let hash = 0;

  if (string.length > 0) {
    for (let i = 0; i < string.length; i += 1) {
      /* eslint-disable no-bitwise */
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
      hash &= hash;
      /* eslint-enable no-bitwise */
    }
  }

  return `hsl(${hash % 360}, 65%, 60%)`;
}

function getInitials(name: string) {
  const [a, b] = name.split(' ');
  return `${a?.[0]?.toUpperCase() ?? ''}${b?.[0]?.toUpperCase() ?? ''}`;
}
