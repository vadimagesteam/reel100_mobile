import React, { useCallback, useMemo } from 'react';
import {
    View,
    TouchableWithoutFeedback,
} from 'react-native';
import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { positionHelpers } from '../../styles';
import { cs } from './styles';
import { DropdownMenuProps } from './types';
import { DropdownButton, DropdownList } from './components';

const DropdownMenu = ({
    data,
    placeholder = 'Choose state',
    onSelect,
    selectedValue,
}: DropdownMenuProps) => {
    const dropdownVisible = useSharedValue(0);

    const selectedItem = useMemo(() => data.find((item) => item.label === selectedValue), [data, selectedValue]);

    const toggleDropdown = useCallback(() => {
        dropdownVisible.value = withTiming(dropdownVisible.value === 0 ? 1 : 0, { duration: 200 });
    }, []);

    const handleSelect = useCallback((label: string | null) => {
        onSelect?.(label);
        dropdownVisible.value = withTiming(0, { duration: 200 });
    }, [onSelect]);

    const animatedArrowStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${dropdownVisible.value * 90}deg` }],
    }));

    const animatedDropdownStyle = useAnimatedStyle(() => ({
        opacity: dropdownVisible.value,
        transform: [{ translateY: dropdownVisible.value * 10 - 10 }],
    }));

    return (
        <View style={[positionHelpers.fill, cs.container]}>
            <DropdownButton onPress={toggleDropdown} selectedItem={selectedItem} placeholder={placeholder} animatedStyle={animatedArrowStyle} />
            <TouchableWithoutFeedback onPress={() => (dropdownVisible.value = withTiming(0, { duration: 200 }))}>
                <DropdownList data={data} onSelect={handleSelect} animatedStyle={animatedDropdownStyle} />
            </TouchableWithoutFeedback>
        </View>
    );
};

export default DropdownMenu;

