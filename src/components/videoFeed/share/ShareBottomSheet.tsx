import { useCallback, useMemo, useState } from 'react';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { Alert, View } from 'react-native';
import { SearchInput, Button, BottomSheet } from '../../ui';
import { SharePeopleList } from './SharePeopleList';
import { useVideoShare } from '../hooks';

export const ShareBottomSheet = () => {
  const { opened, closeShare } = useVideoShare();

  const [search, setSearch] = useState<string>('');
  const [showFooter, setShowFooter] = useState(false);
  const [focused, setFocused] = useState(false);
  const snapPoints = useMemo(() => (focused ? ['90%'] : ['50%']), [focused]);

  const handleClose = useCallback(() => {
    setFocused(false);
    setSearch('');
    setShowFooter(false);
    closeShare();
  }, [closeShare]);

  const handleSelectionChange = useCallback((ids: string[]) => {
    setShowFooter(ids.length > 0);
  }, []);

  const handleShare = () => {
    closeShare();
    Alert.alert('Sent', 'Video has been shared');
  };

  return (
    <BottomSheet open={opened} onClose={handleClose} handleComponent={null} snapPoints={snapPoints}>
      {opened && (
        <>
          <SearchInput
            TextInputComponent={BottomSheetTextInput}
            wrapperClassName="grow-0 m-3 px-3"
            value={search}
            onChangeText={setSearch}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          <SharePeopleList searchQuery={search} onSelectionChanged={handleSelectionChange} />
          {showFooter && (
            <View className="bg-background px-6">
              <Button onPress={handleShare} size="md">
                Send
              </Button>
            </View>
          )}
        </>
      )}
    </BottomSheet>
  );
};
