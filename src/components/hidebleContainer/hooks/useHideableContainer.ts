import { useContext } from 'react';
import { HidebleContainerContext } from '../HidableContainer';

export const useHideableContainer = () => {
  const handles = useContext(HidebleContainerContext);
  if (!handles) {
    throw new Error('useHideableContainer must be used within HidableContainer context');
  }
  return handles;
};
