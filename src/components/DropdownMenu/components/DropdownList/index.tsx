import React from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import { colors, positionHelpers } from '../../../../styles';
import { cs } from '../../styles';
import { BodyText } from '../../../UI';
import { DropdownItem } from '../../types';

interface DropdownListProps {
    data: DropdownItem[];
    onSelect: (label: string | null) => void;
    animatedStyle: any;
}

const DropdownList = ({ data, onSelect, animatedStyle }: DropdownListProps) => (
    <Animated.View style={[positionHelpers.absolute, cs.dropdownList, animatedStyle]}>
        <FlatList
            data={data}
            keyExtractor={(item) => item.value ?? 'default'}
            renderItem={({ item }) => (
                <TouchableOpacity style={cs.option} onPress={() => onSelect(item.label)}>
                    <BodyText fontSize={16} color={colors.silver2}>{item.label}</BodyText>
                </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="handled"
        />
    </Animated.View>
);

export default DropdownList;
