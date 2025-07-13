import { SvgIcon } from '../ui';
import { TouchableOpacity } from 'react-native';
import { useUiStore } from '../../state/app/uiStore';

export const MenuButton = () => {
  const { actions } = useUiStore();
  return (
    <TouchableOpacity
      onPress={() => actions.setMenuOpened(true)}
      hitSlop={{
        left: 5,
        top: 10,
        bottom: 10,
        right: 10,
      }}
    >
      <SvgIcon image="menu" />
    </TouchableOpacity>
  );
};
