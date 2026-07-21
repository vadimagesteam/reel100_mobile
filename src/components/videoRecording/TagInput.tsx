import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { colors } from '../../theme';
import { SvgIcon } from '../ui';
import { normalizeTagLabel, useTagSuggestions } from './hooks/useTagSuggestions';

export const MAX_TAGS = 10;

export interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
}

/**
 * Attach tags when publishing: a chip row of attached tags plus a text field
 * with autocomplete against existing tags. Enter (or picking a suggestion)
 * commits a tag. Normalization mirrors the backend (trim + collapse
 * whitespace; case-insensitive de-dupe) so the client and server agree on what
 * counts as the same tag.
 */
export const TagInput = ({ tags, setTags }: TagInputProps) => {
  const [text, setText] = useState('');
  const { data: suggestions } = useTagSuggestions(text);

  const atCap = tags.length >= MAX_TAGS;

  const addTag = (raw: string) => {
    const label = normalizeTagLabel(raw);
    if (!label || atCap) {
      return;
    }
    const exists = tags.some((t) => t.toLowerCase() === label.toLowerCase());
    if (!exists) {
      setTags([...tags, label]);
    }
    setText('');
  };

  const removeTag = (label: string) => setTags(tags.filter((t) => t !== label));

  // Suggestions not already attached.
  const visibleSuggestions = (suggestions ?? []).filter(
    (s) => !tags.some((t) => t.toLowerCase() === s.name),
  );

  return (
    <View className="rounded-2xl bg-[#d2d4db] px-3 py-2">
      <View className="flex-row flex-wrap items-center gap-1.5">
        {tags.map((tag) => (
          <View
            key={tag}
            className="flex-row items-center gap-1 rounded-full bg-graphite px-2.5 py-1"
          >
            <Text className="text-xs text-white">#{tag}</Text>
            <Pressable hitSlop={8} onPress={() => removeTag(tag)}>
              <Text className="text-xs font-bold text-white">×</Text>
            </Pressable>
          </View>
        ))}
        {!atCap && (
          <TextInput
            className="min-w-[100px] flex-1 p-0 text-black"
            placeholder={tags.length ? 'Add a tag' : 'Add tags…'}
            placeholderTextColor={colors.graphite}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            blurOnSubmit={false}
            value={text}
            onChangeText={setText}
            onSubmitEditing={() => addTag(text)}
          />
        )}
      </View>

      {atCap && <Text className="mt-1 text-[11px] text-graphite/70">Tag limit reached</Text>}

      {visibleSuggestions.length > 0 && !atCap && (
        <View className="mt-2 border-t border-graphite/20 pt-1">
          {visibleSuggestions.slice(0, 6).map((s) => (
            <Pressable
              key={s.id}
              className="flex-row items-center gap-2 py-1.5"
              onPress={() => addTag(s.label)}
            >
              {/* eslint-disable-next-line react-native/no-inline-styles */}
              <SvgIcon image="location" color={colors.graphite} style={{ width: 12, height: 12 }} />
              <Text className="text-graphite">#{s.label}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};
