import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ApiKeyContext from './ApiKeyContext';
import HomeScreen from './components/HomeScreen';
import ApodScreen from './components/ApodScreen';
import AsteroidsScreen from './components/AsteroidsScreen';
import EarthScreen from './components/EarthScreen';
import MarsScreen from './components/MarsScreen';
import EpicScreen from './components/EpicScreen';

// API KEY - 4O7kxB74PxdUdOoK17f0pcqLZn4kJAmUDJrWYgbt

const Tab = createBottomTabNavigator();

const App = () => {
  const [apiKey, setApiKey] = useState('');

  const handleApiKeySet = (key) => {
    setApiKey(key);
  };

  return (
    <ApiKeyContext.Provider value={apiKey}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Home">
            {() => <HomeScreen onApiKeySet={handleApiKeySet} />}
          </Tab.Screen>
          <Tab.Screen name="APOD" component={ApodScreen} />
          <Tab.Screen name="Asteroids" component={AsteroidsScreen} />
          <Tab.Screen name="Earth" component={EarthScreen} />
          <Tab.Screen name="Mars" component={MarsScreen} />
          <Tab.Screen name="EPIC" component={EpicScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </ApiKeyContext.Provider>
  );
};
export default App;
