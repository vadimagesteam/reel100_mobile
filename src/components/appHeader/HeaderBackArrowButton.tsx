import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { SvgIcon } from '../ui';

export const HeaderBackArrowButton = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity hitSlop={20} onPress={() => navigation.goBack()}>
      <SvgIcon image="backArrow" color={colors.white} />
    </TouchableOpacity>
  );
};
