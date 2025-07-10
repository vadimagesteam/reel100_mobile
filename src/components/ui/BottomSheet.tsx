import { StyleSheet } from 'react-native';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import RNBottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetProps as OriginalBottomSheetProps,
} from '@gorhom/bottom-sheet';
import { colors } from '../../theme';

export interface BottomSheetProps extends OriginalBottomSheetProps {
  withBackdrop?: boolean;
  open: boolean;
  onClose: () => void;
}

export const BottomSheet = forwardRef<RNBottomSheet, BottomSheetProps>(
  ({ withBackdrop = true, open, onClose, children, ...rest }, ref) => {
    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
      ),
      [],
    );

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
        index={-1}
        backgroundStyle={styles.backgroundStyle}
        style={styles.bottomSheetStyle}
        handleIndicatorStyle={styles.handleIndicatorStyle}
        onChange={handleSheetChange}
        enableDynamicSizing={false}
        backdropComponent={withBackdrop ? renderBackdrop : undefined}
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

const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: colors.black4,
  },
  bottomSheetStyle: {
    backgroundColor: colors.black4,
  },
  handleIndicatorStyle: {
    backgroundColor: colors.white1,
  },
});
