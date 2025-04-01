import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { BodyText, SvgIcon } from '../../../UI';
import { colors, positionHelpers } from '../../../../styles';
import { cs } from '../../styles';

interface DropdownButtonProps {
    onPress: () => void;
    selectedItem?: { label: string };
    placeholder: string;
    animatedStyle: any;
}

const DropdownButton = ({ onPress, selectedItem, placeholder, animatedStyle }: DropdownButtonProps) => (
    <TouchableOpacity activeOpacity={0.9} style={[positionHelpers.rowFillCenter, cs.dropdownButton]} onPress={onPress}>
        <View style={positionHelpers.alignItemsCenterRow}>
            <SvgIcon image="location" />
            <BodyText fontSize={16} color={colors.silver2} paddingLeft={8} paddingTop={2}>
                {selectedItem?.label || placeholder}
            </BodyText>
        </View>
        <Animated.View style={animatedStyle}>
            <SvgIcon image="arrowBottom" />
        </Animated.View>
    </TouchableOpacity>
);

export default DropdownButton;
