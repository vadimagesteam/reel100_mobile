import { SvgIcon } from '../old/UI';
import { TouchableOpacity } from 'react-native';
import React from 'react';
import { useUiStore } from '../../state/app/uiStore.ts';

export const MenuButton = () => {
  const { actions } = useUiStore();
  return (
    <TouchableOpacity onPress={() => actions.setMenuOpened(true)} hitSlop={20}>
      <SvgIcon image="menu" />
    </TouchableOpacity>
  );
};
