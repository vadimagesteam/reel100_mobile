import Ionicons from '@react-native-vector-icons/ionicons';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { ReactNode } from 'react';
import { useUiStoreActions } from '../../state/app/uiStore';
import { IonIconType } from '../ui';

export interface MenuListItemProps extends TouchableOpacityProps {
  label: ReactNode;
  icon: IonIconType | ReactNode;
}

export const MenuListItem = ({ label, icon, onPress, ...rest }: MenuListItemProps) => {
  const { setMenuOpened } = useUiStoreActions();
  return (
    <TouchableOpacity
      hitSlop={15}
      className="flex-row items-center gap-2.5"
      onPress={(e) => {
        setMenuOpened(false);
        onPress?.(e);
      }}
      {...rest}
    >
      {typeof icon === 'string' ? (
        <Ionicons name={icon as IonIconType} size={18} color="#aaa" />
      ) : (
        icon
      )}
      <Text className="text-[18px] text-silver6">{label}</Text>
    </TouchableOpacity>
  );
};
