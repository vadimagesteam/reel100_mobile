import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
    // const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
    // const animation = useRef(new Animated.Value(0)).current;

    // useEffect(() => {
    //     Animated.timing(animation, {
    //         toValue: dropdownVisible ? 1 : 0,
    //         duration: 200,
    //         useNativeDriver: true,
    //     }).start();
    // }, [dropdownVisible]);

    // const selectedItem = useMemo(() => {
    //     return data.find((item) => item.label === selectedValue);
    // }, [data, selectedValue]);


    // const handleSelect = useCallback((label: string | null) => {
    //     onSelect?.(label);
    //     setDropdownVisible(false);
    // }, [onSelect]);

    // const toggleDropdown = useCallback(() => {
    //     setDropdownVisible((prev) => !prev);
    // }, []);

    return (
        <View style={[positionHelpers.fill, cs.container]}>
            <DropdownButton onPress={toggleDropdown} selectedItem={selectedItem} placeholder={placeholder} animatedStyle={animatedArrowStyle} />

            <TouchableWithoutFeedback onPress={() => (dropdownVisible.value = withTiming(0, { duration: 200 }))}>
                <DropdownList data={data} onSelect={handleSelect} animatedStyle={animatedDropdownStyle} />
            </TouchableWithoutFeedback>
        </View>
        // <View style={[positionHelpers.fill, cs.container]}>
        //     <TouchableOpacity activeOpacity={0.9} style={[positionHelpers.rowFillCenter, cs.dropdownButton]} onPress={toggleDropdown}>
        //         <View style={positionHelpers.alignItemsCenterRow}>
        //             <SvgIcon image="location" />
        //             <BodyText fontSize={16} color={colors.silver2} paddingLeft={8} paddingTop={2}>
        //                 {selectedItem?.label || placeholder}
        //             </BodyText>
        //         </View>
        //         <Animated.View style={animatedArrowStyle}>
        //             <SvgIcon image="arrowBottom" />
        //         </Animated.View>
        //     </TouchableOpacity>

        //     <TouchableWithoutFeedback onPress={() => (dropdownVisible.value = withTiming(0, { duration: 200 }))}>
        //         <Animated.View style={[positionHelpers.absolute, cs.dropdownList, animatedDropdownStyle]}>
        //             <FlatList
        //                 data={data}
        //                 keyExtractor={(item) => item.value ?? 'default'}
        //                 renderItem={({ item }) => (
        //                     <TouchableOpacity style={cs.option} onPress={() => handleSelect(item.label)}>
        //                         <BodyText fontSize={16} color={colors.silver2}>{item.label}</BodyText>
        //                     </TouchableOpacity>
        //                 )}
        //                 keyboardShouldPersistTaps="handled"
        //             />
        //         </Animated.View>
        //     </TouchableWithoutFeedback>
        // </View>
        // <View style={[positionHelpers.fill, cs.container]}>
        //     <TouchableOpacity
        //         activeOpacity={0.9}
        //         style={[positionHelpers.rowFillCenter, cs.dropdownButton]}
        //         onPress={toggleDropdown}
        //     >
        //         <View style={positionHelpers.alignItemsCenterRow}>
        //             <SvgIcon image="location" />
        //             <BodyText fontSize={16} color={colors.silver2} paddingLeft={8} paddingTop={2} >
        //                 {selectedItem?.label || placeholder}
        //             </BodyText>
        //         </View>
        //         <Animated.View
        //             style={{
        //                 transform: [
        //                     {
        //                         rotate: animation.interpolate({
        //                             inputRange: [0, 1],
        //                             outputRange: ['0deg', '90deg'],
        //                         }),
        //                     },
        //                 ],
        //             }}
        //         >
        //             <SvgIcon image="arrowBottom" />
        //         </Animated.View>
        //     </TouchableOpacity>

        //     {dropdownVisible && (
        //         <Animated.View
        //             style={[
        //                 positionHelpers.absolute,
        //                 cs.dropdownList,
        //                 {
        //                     opacity: animation,
        //                     transform: [
        //                         {
        //                             translateY: animation.interpolate({
        //                                 inputRange: [0, 1],
        //                                 outputRange: [-10, 0],
        //                             }),
        //                         },
        //                     ],
        //                 },
        //             ]}
        //         >
        //             <FlatList
        //                 data={data}
        //                 keyExtractor={(item) => item.value ?? 'default'}
        //                 renderItem={({ item }) => (
        //                     <TouchableOpacity
        //                         style={cs.option}
        //                         onPress={() => handleSelect(item.label)}
        //                     >
        //                         <BodyText fontSize={16} color={colors.silver2}>{item.label}</BodyText>
        //                     </TouchableOpacity>
        //                 )}
        //             />
        //         </Animated.View>
        //     )}
        // </View>
    );
};

export default DropdownMenu;

