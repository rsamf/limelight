import { createStackNavigator } from 'react-navigation';
import { AppRegistry } from 'react-native';
import BarNavigator from './components/barNavigator';
import Bar from './components/bar';
import React from 'react';
import globals from './components';

const Root = createStackNavigator({
  BarNavigator: {
    screen: BarNavigator
  },
  Bar: {
    screen: Bar
  }
}, {
  initialRouteName: 'BarNavigator',
  headerMode: 'none',
  gesturesEnabled: false
});

export default Root;

AppRegistry.registerComponent('Spotlight', () => Root);