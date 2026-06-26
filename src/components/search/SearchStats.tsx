import Ionicons from '@react-native-vector-icons/ionicons';
import clsx from 'clsx';
import { Text, View } from 'react-native';
import { colors } from '../../theme';
import { formatNumberShort } from '../../utils';
import { IonIconType } from '../ui/IonIconTypes';

/**
 * A single icon + compact-number stat (e.g. "⬆ 128", "♡ 1.2k"), optionally
 * suffixed with a word ("128 uploads"). Shared by the recommendations cards and
 * the combined-search user rows.
 */
export const StatPill = ({
  icon,
  value,
  label,
  size = 13,
}: {
  icon: IonIconType;
  value: number;
  label?: string;
  size?: number;
}) => (
  <View className="flex-row items-center gap-1">
    <Ionicons name={icon} size={size} color={colors.muted} />
    <Text className="text-xs text-muted">
      {formatNumberShort(value)}
      {label ? ` ${label}` : ''}
    </Text>
  </View>
);

/**
 * State upload counts rendered as "N today · N (7d)". Shared by the
 * combined-search state rows and the state-ranking list.
 */
export const StateStatLine = ({
  uploadsToday,
  uploadsLast7Days,
  textClassName = 'text-xs',
}: {
  uploadsToday: number;
  uploadsLast7Days: number;
  textClassName?: string;
}) => (
  <View className="flex-row items-center gap-2">
    <Ionicons name="cloud-upload-outline" size={14} color={colors.muted} />
    <Text className={clsx('text-muted', textClassName)}>
      {uploadsToday} today · {uploadsLast7Days} (7d)
    </Text>
  </View>
);
