import React from 'react';
import { View } from 'react-native';
import StackNavigator from './Navigation'; 

const App = () => {
  const AppContainer = createAppContainer(StackNavigator);

  return (
    <View style={{ flex: 1 }}>
      <AppContainer />
    </View>
  );
};

export default App;
