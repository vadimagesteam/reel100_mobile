import { cssInterop } from 'nativewind';
import OriginalLinearGradient, { LinearGradientProps } from 'react-native-linear-gradient';
import { colors as _colors } from '../../theme/colors.ts';

cssInterop(OriginalLinearGradient, {
  className: 'style',
});

/**
 * Linerar Gradient brand-styled, with nativewind support
 */
export const LinearGradient = ({ children, ...rest }: LinearGradientProps) => (
  <OriginalLinearGradient {...rest}>{children}</OriginalLinearGradient>
);

export const Reel100Gradient = ({
  children,
  ...rest
}: Omit<LinearGradientProps, 'start' | 'end' | 'colors'>) => (
  <LinearGradient
    start={{ x: 0.1, y: 0.5 }}
    end={{ x: 0.9, y: 0 }}
    colors={[_colors.blue1, _colors.blue]}
    {...rest}
  >
    {children}
  </LinearGradient>
);
