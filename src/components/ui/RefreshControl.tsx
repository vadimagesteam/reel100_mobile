import { RefreshControl as RNRefreshControl } from 'react-native';
import { RefreshControlProps } from 'react-native';
import { colors } from '../../theme/colors.ts';

export const RefreshControl = (props: RefreshControlProps) => (
  <RNRefreshControl {...props} colors={[colors.white]} tintColor={colors.white} />
);
