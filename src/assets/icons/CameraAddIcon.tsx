import React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';

type Props = {
  size?: number;
  color?: string;
  bg?: string | null;
};

export default function CameraAddIcon({ size = 24, color = '#FFF', bg = null }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {bg ? <Rect x={0} y={0} width={24} height={24} rx={4} fill={bg} /> : null}

      <Rect
        x={2}
        y={6}
        width={16}
        height={12}
        rx={2}
        stroke={color}
        strokeWidth={1}
        fill="none"
        strokeLinejoin="round"
      />

      <Path
        d="M22 8.5 L18 11 V13 L22 15.5 V8.5Z"
        stroke={color}
        strokeWidth={1}
        fill="none"
        strokeLinejoin="round"
      />

      <Path d="M9.5 9.5 V14.5 M7 12 H12" stroke={color} strokeWidth={1} strokeLinecap="round" />
    </Svg>
  );
}
