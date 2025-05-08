import React from 'react';
import { Provider } from 'react-redux';
import store from './src/store/store';
import NavigationContainerScreen from './src/navigation/NavigatorContainerScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { positionHelpers } from './src/styles';

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={positionHelpers.fill}>
      <Provider store={store}>
        <NavigationContainerScreen />
      </Provider>
    </GestureHandlerRootView>
  );
}


export default App;
