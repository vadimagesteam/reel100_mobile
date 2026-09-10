import { Text, View } from 'react-native';
import { useNavigation } from '../../navigation';
import { Screens } from '../../navigation/screens';
import { GestureTouchableOpacity } from './GestureTouchableOpacity';
import type { VideoTag } from './queries/apiVideosFetcher';

/** Beyond this the chips would wrap over the video; the rest live on the page. */
const MAX_VISIBLE = 3;

/**
 * The hashtags an author attached, shown with the caption.
 *
 * Until this existed a tag was invisible once the video was posted: it decided
 * which hashtag pages the video appeared on and nothing else, so a poster had
 * no way to see whether their tag had been saved at all.
 *
 * Tapping one opens its hashtag page. GestureTouchableOpacity rather than the
 * plain one because the feed's own pan/tap gestures sit over this.
 */
export const VideoTagChips = ({ tags }: { tags: VideoTag[] }) => {
  const navigation = useNavigation();

  if (!tags.length) {
    return null;
  }

  const visible = tags.slice(0, MAX_VISIBLE);
  const hidden = tags.length - visible.length;

  return (
    <View className="z-30 flex-row flex-wrap items-center gap-1.5">
      {visible.map((tag) => (
        <GestureTouchableOpacity
          key={tag.id}
          hitSlop={8}
          activeOpacity={0.7}
          className="rounded-full bg-black/45 px-2 py-0.5"
          onPress={() =>
            navigation.navigate(Screens.TagFeed, {
              tags: [tag.name],
              title: `#${tag.name}`,
            })
          }
        >
          <Text className="text-[12px] font-semibold text-primary">#{tag.label}</Text>
        </GestureTouchableOpacity>
      ))}
      {hidden > 0 && (
        <Text className="text-[12px] font-semibold text-primary opacity-70">+{hidden}</Text>
      )}
    </View>
  );
};
