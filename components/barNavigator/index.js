

import { createMaterialTopTabNavigator } from 'react-navigation';
import BarHop from './barHop';
import BarList from './barList';
import { Icon } from 'react-native-elements';
import globals from '../helpers';
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
      backgroundColor: globals.sBlack,
      zIndex: 10
    },
    activeTintColor: globals.sGreen,
    indicatorStyle: {
      backgroundColor: globals.sGrey
    }
  }
});

export default class BarNavigator extends React.Component {
  static router = Root.router;

  constructor(props){
    super(props);

    this.state = {
      opened: false
    };
  }

  render() {
    return (
      <Root screenProps={this.props.screenProps} navigation={this.props.navigation}/>
    );
  }
}