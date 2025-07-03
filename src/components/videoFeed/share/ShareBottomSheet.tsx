import { useCallback, useEffect, useMemo, useState } from 'react';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { Alert, View } from 'react-native';
import { Button } from '../../ui/Button';
import { SharePeopleList } from './SharePeopleList';
import { useVideoShare } from '../hooks';
import { BottomSheet } from '../../ui/BottomSheet';

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

  const handleShare = () => {
    closeShare();
    Alert.alert('Sent', 'Video has been shared');
  };

  return (
    <BottomSheet open={opened} onClose={handleClose} handleComponent={null} snapPoints={snapPoints}>
      {opened && (
        <>
          <BottomSheetTextInput
            className="m-3 mb-0 h-10 rounded-full bg-[#222] px-3 text-white"
            placeholder="Search"
            placeholderTextColor="#aaa"
            value={search}
            onChangeText={setSearch}
            clearButtonMode="always"
            returnKeyType="search"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          <SharePeopleList
            searchQuery={search}
            onSelectionChanged={(ids) => setShowFooter(ids.length > 0)}
          />
          {showFooter && (
            <View className="bg-black4 px-6">
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
