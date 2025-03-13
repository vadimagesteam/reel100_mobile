import React from 'react';
import { Provider } from 'react-redux';
import store from './src/store/store';
import NavigationContainerScreen from './src/navigation/NavigatorContainerScreen';


function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <NavigationContainerScreen />
    </Provider>
  );
}


export default App;
