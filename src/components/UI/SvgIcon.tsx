import React from 'react';
import { ViewStyle } from 'react-native';

import Svg from 'react-native-svg';
import { SvgIconProps, SvgIconsNames } from '../../assets/icons/typesSvg';
import sourcesSvg from '../../assets/icons/sourcesSvg';

interface Props {
    image: SvgIconsNames | string;
    color?: string;
    style?: ViewStyle;
}

const SvgIcon = ({ image, color, style }: Props) => {
    const { Draw, width, height, viewBox }: SvgIconProps = sourcesSvg[image];

    if (Draw === null) {
        return null;
    }

    const sizes = {
        height: style?.height ?? height,
        width: style?.width ?? width,
    };

    return (
        <Svg height={sizes?.height} width={sizes?.width} viewBox={viewBox}>
            <Draw color={color} />
        </Svg>
    );
};

export default SvgIcon;
