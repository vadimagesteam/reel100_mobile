import RNBottomSheet, { BottomSheetProps as OriginalBottomSheetProps } from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import { bottomSheetStyles } from './styles';
import { useBottomSheetBackdrop } from './useBottomSheetBackdrop';

export interface BottomSheetProps extends OriginalBottomSheetProps {
  withBackdrop?: boolean;
  open: boolean;
  onClose: () => void;
}

export const BottomSheet = forwardRef<RNBottomSheet, BottomSheetProps>(
  ({ withBackdrop = true, open, onClose, children, ...rest }, ref) => {
    const backdrop = useBottomSheetBackdrop();

    const sheetRef = useRef<RNBottomSheet>(null);

    useImperativeHandle(ref, () => sheetRef.current!);

    useEffect(() => {
      if (open) {
        sheetRef.current?.snapToIndex(0);
      } else {
        sheetRef.current?.close();
      }
    }, [open]);

    const handleSheetChange = useCallback(
      (index: number) => {
        if (index === -1) {
          onClose();
        }
      },
      [onClose],
    );

    return (
      <RNBottomSheet
        ref={sheetRef}
        index={open ? 0 : -1}
        backgroundStyle={bottomSheetStyles.backgroundStyle}
        style={bottomSheetStyles.bottomSheetStyle}
        handleIndicatorStyle={bottomSheetStyles.handleIndicatorStyle}
        onChange={handleSheetChange}
        enableDynamicSizing={false}
        backdropComponent={withBackdrop ? backdrop : undefined}
        enablePanDownToClose
        keyboardBehavior="extend"
        // animationConfigs={animationConfigs}
        {...rest}
      >
        {children}
      </RNBottomSheet>
    );
  },
);
