import React from 'react';
import { StyleSheet, TouchableOpacity, Animated, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { BlurView } from 'react-native-blur';
import globals from '../helpers';

export default class Blur extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      opacity: new Animated.Value(0),
      position: new Animated.Value(50)
    };
  }

  componentDidMount() {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 200
    }).start();
    Animated.timing(this.state.position, {
      toValue: 0,
      duration: 200
    }).start();
  }

  close() {
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: 200
    }).start();
    Animated.timing(this.state.position, {
      toValue: 50,
      duration: 200
    }).start(({ finished }) => {
      if (finished) {
        this.props.close()
      }
    });
  }

  goToProfile() {
    console.warn('going');
    this.props.goToProfile();
  }
  
  render(){
    return (
      <Animated.View style={{...globals.style.fullscreen, top: this.state.position}} opacity={this.state.opacity}>
        <BlurView style={globals.style.fullscreen} viewRef={this.props.viewRef} blurType="dark" blurAmount={3}/>
        <View style={style.children}>
          {this.props.children}
        </View>
        <TouchableOpacity style={style.cancel} onPress={()=>this.close()}>
          <Icon size={30} color={globals.sWhite} name="x" type="feather"/>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

const style = StyleSheet.create({
  cancel: {
    position: 'absolute',
    top: 20,
    left: 20
  },
  children: {
    marginTop: 50,
    flex: 1
  }
});