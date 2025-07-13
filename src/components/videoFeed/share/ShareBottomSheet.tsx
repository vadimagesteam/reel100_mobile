import { useCallback, useMemo, useRef, useState } from 'react';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { Alert, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLoadingCallback } from '../../../hooks/useLoadingCallback';
import { useSendMessage } from '../../chat/hooks';
import { SearchInput, Button, BottomSheet } from '../../ui';
import { SharePeopleList } from './SharePeopleList';
import { useVideoFeedCacheKey, useVideoShare } from '../hooks';

export const ShareBottomSheet = () => {
  const cacheKey = useVideoFeedCacheKey();
  const { opened, share, closeShare } = useVideoShare();
  const { mutateAsync: sendMessage } = useSendMessage();
  const [search, setSearch] = useState<string>('');
  const [showFooter, setShowFooter] = useState(false);
  const [focused, setFocused] = useState(false);
  const snapPoints = useMemo(() => (focused ? ['90%'] : ['50%']), [focused]);
  const insets = useSafeAreaInsets();

  const handleClose = useCallback(() => {
    setFocused(false);
    setSearch('');
    setShowFooter(false);
    closeShare();
  }, [closeShare]);

  const selectedIds = useRef<string[]>([]);

  const handleSelectionChange = useCallback((ids: string[]) => {
    setShowFooter(ids.length > 0);
    selectedIds.current = ids;
  }, []);

  const [handleShare, isSharing] = useLoadingCallback(async () => {
    await Promise.all(
      selectedIds.current.map((userId) =>
        sendMessage({
          videoId: share?.videoId!,
          toUserId: userId,
          text: 'I shared video with you',
        }),
      ),
    );
    closeShare();
    Alert.alert('Sent', 'Video has been shared');
  });

  // When video is opened via video screen add insets to the share button
  // fixme: think about better solution here
  let shareButtonBottomInset = cacheKey?.[0] === 'video_modal' ? insets.bottom : 0;

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
            <View className="bg-background px-6" style={{ paddingBottom: shareButtonBottomInset }}>
              <Button loading={isSharing} onPress={handleShare} size="md">
                Send
              </Button>
            </View>
          )}
        </>
      )}
    </BottomSheet>
  );
};
