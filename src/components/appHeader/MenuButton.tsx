import { SvgIcon } from '../ui';
import { TouchableOpacity } from 'react-native';
import { useUiStore } from '../../state/app/uiStore';

export const MenuButton = () => {
  const { actions } = useUiStore();
  return (
    <TouchableOpacity onPress={() => actions.setMenuOpened(true)} hitSlop={20}>
      <SvgIcon image="menu" />
    </TouchableOpacity>
  );
};
