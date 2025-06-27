import { useContext } from 'react';
import { HidebleContainerContext } from '../HidableContainer.tsx';

export const useHideableContainer = () => {
  const handles = useContext(HidebleContainerContext);
  if (!handles) {
    throw new Error('useHideableContainer must be used within HidableContainer context');
  }
  return handles;
};
