import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { colors, positionHelpers } from '../../../../styles';
import { cs } from '../../styles';
import { BodyText } from '../../../UI';
import { DropdownItem } from '../../types';

interface DropdownListProps {
    data: DropdownItem[];
    onSelect: (label: string | null) => void;
    animatedStyle: any;
    selectedValue: string | null
}

const DropdownList = ({ data, onSelect, animatedStyle, selectedValue }: DropdownListProps) => (
    <Animated.View style={[positionHelpers.absolute, cs.dropdownList, animatedStyle]}>
        <FlatList
            data={data}
            keyExtractor={(item) => item.value ?? 'default'}
            renderItem={({ item }) => (
                <TouchableOpacity style={[positionHelpers.rowFillCenter, cs.option]} onPress={() => onSelect(item.label)}>
                    <BodyText fontSize={16} color={colors.silver2}>{item.label}</BodyText>
                    {item?.label === selectedValue && <View style={cs.selectedDot} />}
                </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="handled"
        />
    </Animated.View>
);

export default DropdownList;
