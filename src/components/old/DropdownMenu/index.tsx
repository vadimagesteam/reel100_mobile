import React, { useCallback, useMemo } from 'react';
import { TouchableWithoutFeedback, View, ViewProps } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { positionHelpers } from '../../../styles';
import { cs } from './styles.ts';
import { DropdownMenuProps } from './types.ts';
import { DropdownButton, DropdownList } from './components';

const DropdownMenu = ({
  data,
  placeholder = 'Choose state',
  onSelect,
  selectedValue,
  style: viewStyle,
}: DropdownMenuProps & Pick<ViewProps, 'style'>) => {
  const dropdownVisible = useSharedValue(0);

  const selectedItem = useMemo(
    () => data.find((item) => item.slug === selectedValue || item.id === selectedValue),
    [data, selectedValue],
  );

  const toggleDropdown = useCallback(() => {
    dropdownVisible.value = withTiming(dropdownVisible.value === 0 ? 1 : 0, { duration: 200 });
  }, []);

  const handleSelect = useCallback(
    (value: string | null) => {
      onSelect?.(value);
      dropdownVisible.value = withTiming(0, { duration: 200 });
    },
    [onSelect],
  );

  const animatedArrowStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${dropdownVisible.value * 90}deg` }],
  }));

  const animatedDropdownStyle = useAnimatedStyle(() => ({
    opacity: dropdownVisible.value,
    transform: [{ translateY: dropdownVisible.value * 10 - 10 }],
    zIndex: dropdownVisible.value > 0 ? 9999 : -1,
  }));

  return (
    <View style={[positionHelpers.fill, cs.container, viewStyle]}>
      <DropdownButton
        onPress={toggleDropdown}
        selectedItem={selectedItem}
        placeholder={placeholder}
        animatedStyle={animatedArrowStyle}
      />

      <TouchableWithoutFeedback
        onPress={() => (dropdownVisible.value = withTiming(0, { duration: 200 }))}
      >
        <DropdownList
          data={data}
          dropdownVisible={dropdownVisible?.value}
          onSelect={handleSelect}
          animatedStyle={animatedDropdownStyle}
          selectedValue={selectedItem?.label ?? null}
        />
      </TouchableWithoutFeedback>
    </View>
  );
};

export default DropdownMenu;
