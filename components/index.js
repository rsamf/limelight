import { createStackNavigator } from 'react-navigation';
import { View, findNodeHandle } from 'react-native';
import BarList from './barList';
import Bar from './bar';
import React from 'react';
import globals from '../util';
import Header from './header';
import Blur from './blurs';
import ProfileBlur from './blurs/profile';
import LocalPlaylists from '../util/LocalPlaylists';
// AppSync
import { Rehydrated } from 'aws-appsync-react';
import { ApolloProvider } from 'react-apollo';
import user from '../util/user';
import spotify from '../util/spotify';
import net from '../util/net';
import Offline from './offline';

const Root = createStackNavigator({
  BarList: {
    screen: BarList
  },
  Bar: {
    screen: Bar
  }
}, {
  initialRouteName: 'BarList',
  headerMode: 'none',
  gesturesEnabled: false
});

export default class Limelight extends React.Component {
  constructor(props){
    super(props);
    const playlists = new LocalPlaylists(this);
    this.state = {
      isOnline: true,
      user: null,
      playlists,
      blur: null,
      blurProps: {
        close: () => this.setOpenedBlur(null),
        goToProfile: () => this.setOpenedBlur(ProfileBlur),
        addToUserPlaylists: playlist => user.addPlaylist(this, playlist),
        playlists
      },
      header: {
        name: "Playlists",
        user: null,
        playlist: null,
        openBlur: (blur, props)=>this.setOpenedBlur(blur, props)
      }
    };
  }

  componentDidMount(){
    spotify.initialize();
    user.get(this);
    net.init(this);
  }

  setOpenedBlur(blur, props) {
    this.setState({ 
      blur,
      blurProps: {
        ...this.state.blurProps,
        ...props,
      }
    });
  }

  render(){
    let propsToPass = {
      user: this.state.user,
      playlists: this.state.playlists,
      openBlur: (blur, props) => this.setOpenedBlur(blur, props),
      goToLogin: () => this.setOpenedBlur(ProfileBlur),
      setHeader: options => this.setState({ header: {...this.state.header, ...options} })
    };
    return (
      <ApolloProvider client={globals.client}>
        <Rehydrated>
          <View style={globals.style.view}>
            <View style={globals.style.fullscreen} ref="view" onLayout={()=>this.setState({ viewRef: findNodeHandle(this.refs.view) })}>
              <Header {...this.state.header} isOnline={this.state.isOnline}/>
              {
                this.state.isOnline ?
                <Root screenProps={propsToPass}/> :
                <Offline retry={()=>net.get()}/>
              }
            </View>
            {this.renderBlurs()}
          </View>
        </Rehydrated>
      </ApolloProvider>
    );
  }
  
  renderBlurs() {
    const InnerContent = this.state.blur;
    if(InnerContent) {
      return (
        <Blur 
          viewRef={this.state.viewRef}
          close={()=>this.setOpenedBlur(null)}
        >
          <InnerContent {...this.state.blurProps} isOnline={this.state.isOnline}/>
        </Blur>
      );
    }
  }
}