import SvgIcon from '../ui/SvgIcon.tsx';
import { colors } from '../../theme/colors.ts';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { ReactNode } from 'react';
import { useUiStoreActions } from '../../state/app/uiStore.ts';

export interface MenuListItemProps extends TouchableOpacityProps {
  label: ReactNode;
  icon: string | ReactNode;
}

export const MenuListItem = ({ label, icon, onPress, ...rest }: MenuListItemProps) => {
  const { setMenuOpened } = useUiStoreActions();
  return (
    <TouchableOpacity
      hitSlop={15}
      className="flex-row gap-2.5"
      onPress={(e) => {
        setMenuOpened(false);
        onPress?.(e);
      }}
      {...rest}
    >
      {typeof icon === 'string' ? <SvgIcon color={colors.silver6} image={icon} /> : icon}
      <Text className="text-[18px] text-silver6">{label}</Text>
    </TouchableOpacity>
  );
};
