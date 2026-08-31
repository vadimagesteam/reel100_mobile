import { Pressable, Text, TextInput, View } from 'react-native';
import { colors } from '../../theme';
import { SvgIcon } from '../ui';
import { normalizeTagLabel, useTagSuggestions } from './hooks/useTagSuggestions';

export const MAX_TAGS = 10;

export interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
  /** The tag being typed. Owned by the posting screen — see commitPendingTag. */
  draft: string;
  setDraft: (draft: string) => void;
}

/**
 * Add `raw` to `tags` if it is a new, non-blank tag and there is room.
 *
 * Publishing calls this with whatever is still in the text field: a tag that
 * was typed but never confirmed with Enter or a suggestion tap used to be
 * thrown away, so the video posted without the hashtag its author had written.
 */
export const commitPendingTag = (tags: string[], raw: string): string[] => {
  const label = normalizeTagLabel(raw);
  if (!label || tags.length >= MAX_TAGS) {
    return tags;
  }
  if (tags.some((t) => t.toLowerCase() === label.toLowerCase())) {
    return tags;
  }
  return [...tags, label];
};

/**
 * Attach tags when publishing: a chip row of attached tags plus a text field
 * with autocomplete against existing tags. Enter (or picking a suggestion)
 * commits a tag. Normalization mirrors the backend (trim + collapse
 * whitespace; case-insensitive de-dupe) so the client and server agree on what
 * counts as the same tag.
 *
 * The field keeps the keyboard's autocorrect on and matches the caption's dark
 * keyboard: the two inputs sit one above the other, and a light keyboard under
 * a dark one reads as a glitch.
 */
export const TagInput = ({ tags, setTags, draft, setDraft }: TagInputProps) => {
  const { data: suggestions } = useTagSuggestions(draft);

  const atCap = tags.length >= MAX_TAGS;

  const addTag = (raw: string) => {
    setTags(commitPendingTag(tags, raw));
    setDraft('');
  };

  const removeTag = (label: string) => setTags(tags.filter((t) => t !== label));

  // Suggestions not already attached.
  const visibleSuggestions = (suggestions ?? []).filter(
    (s) => !tags.some((t) => t.toLowerCase() === s.name),
  );

  return (
    <View className="rounded-2xl bg-[#d2d4db] px-3 py-2.5">
      <View className="flex-row flex-wrap items-center gap-1.5">
        {tags.map((tag) => (
          <View
            key={tag}
            className="flex-row items-center gap-1.5 rounded-full bg-graphite px-3 py-1"
          >
            <Text className="text-sm text-white">#{tag}</Text>
            <Pressable hitSlop={8} onPress={() => removeTag(tag)}>
              <Text className="text-sm font-bold text-white">×</Text>
            </Pressable>
          </View>
        ))}
        {!atCap && (
          <TextInput
            className="min-w-[100px] flex-1 p-0 text-[16px] text-black"
            placeholder={tags.length ? 'Add a tag' : 'Add tags…'}
            placeholderTextColor={colors.graphite}
            autoCapitalize="none"
            autoCorrect
            spellCheck
            keyboardAppearance="dark"
            returnKeyType="done"
            blurOnSubmit={false}
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={() => addTag(draft)}
          />
        )}
      </View>

      {atCap && <Text className="mt-1 text-xs text-graphite/70">Tag limit reached</Text>}

      {visibleSuggestions.length > 0 && !atCap && (
        <View className="mt-2 border-t border-graphite/20 pt-1">
          {visibleSuggestions.slice(0, 6).map((s) => (
            <Pressable
              key={s.id}
              className="flex-row items-center gap-2 py-2"
              onPress={() => addTag(s.label)}
            >
              {/* eslint-disable-next-line react-native/no-inline-styles */}
              <SvgIcon image="location" color={colors.graphite} style={{ width: 14, height: 14 }} />
              <Text className="text-[16px] text-graphite">#{s.label}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};
