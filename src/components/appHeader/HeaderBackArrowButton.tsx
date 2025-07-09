import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { SvgIcon } from '../ui';

export const HeaderBackArrowButton = (props: Omit<TouchableOpacityProps, 'onPress'>) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity hitSlop={20} onPress={() => navigation.goBack()} {...props}>
      <SvgIcon image="backArrow" color={colors.white} />
    </TouchableOpacity>
  );
};
