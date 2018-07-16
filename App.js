import { createMaterialTopTabNavigator } from 'react-navigation';
import Home from './components/home';
import BarHop from './components/barHop';
// import Bar from './components/bar';
import { AppRegistry } from 'react-native';
import { Icon, Card } from 'react-native-elements';
import React from 'react';
import globals from './components';

const Root = createMaterialTopTabNavigator({
  BarHop: {
    screen: BarHop,
    navigationOptions: {
      tabBarIcon: ({tintColor}) => (
        <Icon type="entypo" color={tintColor} name="add-to-list"/>
      )
    }
  },
  Home: {
    screen: Home,
    navigationOptions: {
      tabBarIcon: ({tintColor}) => (
        <Icon type="entypo" color={tintColor} name="list"/>
      )
    }
  }
}, {
  initialRouteName: 'Home',
  tabBarOptions: {
    showIcon: true,
    showLabel: false,
    style: {
      backgroundColor: globals.sBlack
    },
    activeTintColor: globals.sGreen,
    indicatorStyle: {
      backgroundColor: globals.sGrey
    }
  }
});

export default Root;

AppRegistry.registerComponent('Spotlight', () => Root);