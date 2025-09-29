import Ionicons from '@react-native-vector-icons/ionicons';
import { ReactNode } from 'react';
import { FieldError } from 'react-hook-form';
import { TouchableOpacity, View, ViewProps } from 'react-native';
import Animated, { type AnimatedProps } from 'react-native-reanimated';
import { FieldLabel } from './FieldLabel';
import { RequiredWildcard } from './RequiredWildcard';
import { ValidationMessage } from './ValidationMessage';

export interface FormItemProps {
  requiredMark?: boolean;
  hasHelp?: boolean;
  onHelpPress?: () => void;
  label: string;
  error?: FieldError;
  children: ReactNode;
  viewProps?: Pick<
    AnimatedProps<ViewProps>,
    'className' | 'entering' | 'exiting' | 'animatedProps'
  >;
}

export const FormItem = ({
  label,
  error,
  requiredMark,
  viewProps,
  hasHelp,
  onHelpPress,
  children,
}: FormItemProps) => {
  return (
    <Animated.View {...(viewProps ? viewProps : {})} className="flex-col gap-2">
      <View className="flex-row items-center gap-x-[8px]">
        <FieldLabel>
          {label}
          {requiredMark && (
            <>
              {' '}
              <RequiredWildcard />
            </>
          )}
        </FieldLabel>
        {hasHelp && (
          <TouchableOpacity
            onPress={onHelpPress}
            hitSlop={{ left: 10, top: 8, right: 10, bottom: 4 }}
            className="size-[18px] items-center justify-center rounded-full bg-zinc-500"
          >
            <Ionicons name="help-outline" size={12} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
      {children}
      {error && <ValidationMessage>{error.message}</ValidationMessage>}
    </Animated.View>
  );
};
