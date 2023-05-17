import { registerRootComponent } from 'expo';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from './HomeScreen';
import NASAImageScreen from './NASAImageScreen';

const TabNavigator = createBottomTabNavigator({
  Home: HomeScreen,
  NASAImage: NASAImageScreen,
});

const StackNavigator = createStackNavigator(
  {
    Main: TabNavigator,
  },
  {
    initialRouteName: 'Main',
    headerMode: 'none',
  }
);

const AppContainer = createAppContainer(StackNavigator);

// Зарегистрируйте AppContainer с использованием registerRootComponent
registerRootComponent(() => AppContainer);
