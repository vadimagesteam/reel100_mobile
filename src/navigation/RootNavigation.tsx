import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './AppNavigator';
import { AuthNavigator } from './AuthNavigator';
import { navigationRef } from './navigationRef';
import { DrawerMenuWrapper } from '../components/menu/DrawerMenuWrapper';

export interface RootNavigationProps {
  isAuthenticated: boolean;
}

export function RootNavigation({ isAuthenticated }: RootNavigationProps) {
  return (
    <DrawerMenuWrapper>
      <NavigationContainer ref={navigationRef}>
        {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </DrawerMenuWrapper>
  );
}
