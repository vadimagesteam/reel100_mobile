import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import {
  CompositeNavigationProp,
  useNavigation as useRNNavigation,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList, BottomTabParamList } from '../screens';

/**
 * Type safe navigation
 */
export const useNavigation = () =>
  useRNNavigation<
    CompositeNavigationProp<
      BottomTabNavigationProp<BottomTabParamList>,
      NativeStackNavigationProp<AppStackParamList>
    >
  >();
