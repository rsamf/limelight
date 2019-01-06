import { AppRegistry, StatusBar } from 'react-native';
import Limelight from './components';
import Messages from './components/messages';
import LocalMessages from './util/LocalMessages';
import React from 'react';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    StatusBar.setBarStyle('light-content', true);

    this.state = {
      messages: new LocalMessages(this),
      finishedReading: false
    };
  }

  finishReading() {
    this.setState({
      finishedReading: true
    });
  }

  render() {
    if(this.state.finishedReading) {
      return <Limelight/>;
    } else {
      return (
        <Messages ready={this.state.messages.ready} finishReading={()=>this.finishReading()}>
          {this.state.messages.unreadMessages}
        </Messages>
      );
    }
  }
}

AppRegistry.registerComponent('Limelight', () => App);
