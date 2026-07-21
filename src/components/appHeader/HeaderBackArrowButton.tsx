import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme';
import { CircleIconButton, CircleIconButtonProps, SvgIcon } from '../ui';

export const HeaderBackArrowButton = (props: Omit<CircleIconButtonProps, 'onPress' | 'children'>) => {
  const navigation = useNavigation();
  return (
    <CircleIconButton hitSlop={20} onPress={() => navigation.goBack()} {...props}>
      <SvgIcon image="backArrow" color={colors.white} />
    </CircleIconButton>
  );
};
