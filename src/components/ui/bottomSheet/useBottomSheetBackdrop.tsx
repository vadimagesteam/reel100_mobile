import { BottomSheetBackdropProps, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import React, { useCallback } from 'react';

export const useBottomSheetBackdrop = () => {
  return useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    [],
  );
};
