import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    View,
    TouchableOpacity,
    FlatList,
    Animated,
} from 'react-native';
import { colors, positionHelpers } from '../../styles';
import { BodyText, SvgIcon } from '../UI';
import { cs } from './styles';
import { DropdownMenuProps } from './types';

const DropdownMenu = ({
    data,
    placeholder = 'Choose state',
    onSelect,
    selectedValue,
}: DropdownMenuProps) => {
    const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
    const animation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animation, {
            toValue: dropdownVisible ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [dropdownVisible]);

    const selectedItem = useMemo(() => {
        return data.find((item) => item.value === selectedValue);
    }, [data, selectedValue]);

    const handleSelect = useCallback((value: string | null) => {
        onSelect?.(value);
        setDropdownVisible(false);
    }, [onSelect]);

    const toggleDropdown = useCallback(() => {
        setDropdownVisible((prev) => !prev);
    }, []);

    return (
        <View style={[positionHelpers.fill, cs.container]}>
            <TouchableOpacity
                activeOpacity={0.9}
                style={[positionHelpers.rowFillCenter, cs.dropdownButton]}
                onPress={toggleDropdown}
            >
                <BodyText fontSize={16} color={colors.silver2}>
                    {selectedItem?.label || placeholder}
                </BodyText>
                <Animated.View
                    style={{
                        transform: [
                            {
                                rotate: animation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', '90deg'],
                                }),
                            },
                        ],
                    }}
                >
                    <SvgIcon image="arrowBottom" />
                </Animated.View>
            </TouchableOpacity>

            {dropdownVisible && (
                <Animated.View
                    style={[
                        positionHelpers.absolute,
                        cs.dropdownList,
                        {
                            opacity: animation,
                            transform: [
                                {
                                    translateY: animation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [-10, 0],
                                    }),
                                },
                            ],
                        },
                    ]}
                >
                    <FlatList
                        data={data}
                        keyExtractor={(item) => item.value ?? 'default'}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={cs.option}
                                onPress={() => handleSelect(item.value)}
                            >
                                <BodyText fontSize={16} color={colors.silver2}>{item.label}</BodyText>
                            </TouchableOpacity>
                        )}
                    />
                </Animated.View>
            )}
        </View>
    );
};

export default DropdownMenu;

