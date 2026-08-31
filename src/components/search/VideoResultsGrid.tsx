import Ionicons from '@react-native-vector-icons/ionicons';
import { Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useNavigation } from '../../navigation';
import { Screens } from '../../navigation/screens';
import { colors } from '../../theme';
import { formatNumberShort, videoDisplayTitle } from '../../utils';
import { SearchVideoResult } from './types';

/**
 * Search's video results as poster frames rather than rows.
 *
 * Videos are the one section where the row layout worked against the content:
 * a creator or a hashtag is a name, but a video is a picture, and a list of
 * 44px play icons says nothing about which one you were looking for. The other
 * three sections stay as rows.
 *
 * The card carries no width of its own so it can be laid out two ways: the
 * preview card wraps it in a half-width cell, and the "View all" screen hands
 * it to a two-column FlashList, whose cells are already half-width.
 */
export const VideoResultCard = ({ item }: { item: SearchVideoResult }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="flex-1 px-1.5 pb-3"
      onPress={() => navigation.navigate(Screens.VideoModal, { videoId: item.id })}
    >
      <View className="aspect-[3/4] w-full overflow-hidden rounded-xl bg-input">
        {item.thumbnail ? (
          <FastImage
            className="size-full"
            source={{ uri: item.thumbnail, priority: FastImage.priority.normal }}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : (
          <View className="size-full items-center justify-center">
            <Ionicons name="play" size={28} color={colors.muted} />
          </View>
        )}

        <View className="absolute bottom-1.5 left-1.5 flex-row items-center gap-1 rounded-full bg-black/60 px-2 py-0.5">
          <Ionicons name="heart" size={11} color={colors.white} />
          <Text className="text-[11px] font-semibold text-white">
            {formatNumberShort(item.likesCount)}
          </Text>
        </View>
      </View>

      <Text numberOfLines={2} className="mt-1.5 text-sm font-semibold text-primary">
        {videoDisplayTitle(item)}
      </Text>
      <Text numberOfLines={1} className="mt-0.5 text-xs text-muted">
        {item.user.name}
      </Text>
    </TouchableOpacity>
  );
};

/** The 2-column preview inside the results screen's Videos card. */
export const VideoResultsGrid = ({ items }: { items: SearchVideoResult[] }) => (
  <View className="flex-row flex-wrap px-2.5 pt-2">
    {items.map((item) => (
      <View key={item.id} className="w-1/2 flex-row">
        <VideoResultCard item={item} />
      </View>
    ))}
  </View>
);
