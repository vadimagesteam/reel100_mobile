import { useRoute as useRNRoute, RouteProp } from '@react-navigation/native';
import type { AppStackParamList } from '../screens';

export const useRoute = <T extends keyof AppStackParamList>() =>
  useRNRoute<RouteProp<AppStackParamList, T>>();
