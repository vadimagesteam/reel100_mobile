import React from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';
import { positionHelpers } from '../../../../styles';

interface CustomTabBarButtonProps {
    children: React.ReactNode;
    onPress: () => void;
    style?: ViewStyle;
}

const CustomTabBarButton: React.FC<CustomTabBarButtonProps> = ({ children, onPress, style }) => {
    return (
        <TouchableOpacity style={[positionHelpers.fillCenter, style]} onPress={onPress}>
            {children}
        </TouchableOpacity>
    );
};

export default CustomTabBarButton;
