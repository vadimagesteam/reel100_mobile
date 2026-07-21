import { TextInput, TextStyle, View, Text } from 'react-native';
import { colors } from '../../theme';
import { SvgIcon } from '../ui';

export interface VideoDescriptionInputProps {
  value: string;
  setValue: (value: string) => void;
}

/**
 * Single source of truth for the caption limit. See the caption-limit decision:
 * kept at 600 (what the DB already allows for), display and enforcement share
 * this one constant.
 */
export const DescriptionMaxLength = 600;

const inputStyle: TextStyle = {
  // Grow with content up to a few lines, then scroll inside the card rather
  // than pushing the layout around.
  minHeight: 40,
  maxHeight: 120,
  textAlignVertical: 'top',
};

/**
 * Always-visible caption card: a speech-bubble icon, a "Write a caption…"
 * placeholder, and a live n/limit counter in the corner. Replaces the old
 * floating pill that collapsed to 160×40 and expanded on tap with hardcoded
 * absolute `bottom` offsets — the fragile part this rewrite removes. The card
 * is a normal block in the posting screen's bottom stack, which is lifted above
 * the keyboard by a KeyboardStickyView there.
 */
export const VideoDescriptionInput = ({ value, setValue }: VideoDescriptionInputProps) => {
  return (
    <View className="rounded-2xl bg-[#d2d4db] px-3 pb-1.5 pt-2.5">
      <View className="flex-row items-start gap-2">
        <SvgIcon image="commentIcon" color={colors.graphite} style={captionIconStyle} />
        <TextInput
          multiline
          returnKeyType="done"
          submitBehavior="blurAndSubmit"
          keyboardAppearance="dark"
          maxLength={DescriptionMaxLength}
          className="flex-1 p-0 text-black"
          style={inputStyle}
          placeholder="Write a caption..."
          placeholderTextColor={colors.graphite}
          value={value}
          onChangeText={setValue}
        />
      </View>
      <Text className="self-end text-[11px] text-graphite/70">
        {value.length}/{DescriptionMaxLength}
      </Text>
    </View>
  );
};

const captionIconStyle = { width: 18, height: 18, marginTop: 2 };
