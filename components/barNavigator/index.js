

import { createMaterialTopTabNavigator } from 'react-navigation';
import BarHop from './barHop';
import BarList from './barList';
import { Icon } from 'react-native-elements';
import globals from '..';
import React from 'react';

const Root = createMaterialTopTabNavigator({
  BarHop: {
    screen: BarHop,
    navigationOptions: {
      tabBarIcon: ({tintColor}) => (
        <Icon type="entypo" color={tintColor} name="add-to-list"/>
      )
    }
  },
  BarList: {
    screen: BarList,
    navigationOptions: {
      tabBarIcon: ({tintColor}) => (
        <Icon type="entypo" color={tintColor} name="list"/>
      )
    }
  }
}, {
  initialRouteName: 'BarList',
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