import React from 'react';
import { View, StyleSheet, Animated, PanResponder } from 'react-native';
import { Icon } from 'react-native-elements';

export default class extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      view: {
        top: new Animated.Value(0)
      },
      contentHeight: 0,
      opened: false
    };
  }

  getPosition(val){
    val = Math.max(0, val);
    val = Math.min(1, val);
    val = -(1-val)*this.state.contentHeight;
    return val;
  }

  open(){
    Animated.timing(this.state.view.top, {
      toValue: 0,
      duration: 500
    }).start();
    this.setState({
      opened: true
    });
  }

  close(){
    Animated.timing(this.state.view.top, {
      toValue: -this.state.contentHeight,
      duration: 500
    }).start();
    this.setState({
      opened: false
    });
  }

  // flag = false;
  onContentLayout(evt){
    // if(this.flag) return;
    // this.flag = true;
    let height = evt.nativeEvent.layout.height;
    this.setState({
      contentHeight: height,
      view: {
        top: new Animated.Value(-height)
      }
    })
  }

  render(){
    return (
      <Animated.View style={{...this.state.view, ...this.style.view}}>
        <View onLayout={(evt)=>this.onContentLayout(evt)} style={this.style.content}>
          {this.props.children}
        </View>
        <View style={this.style.handle} {...this.responder.panHandlers}>
          <Icon size={14} name="chevron-small-down" type="entypo" color={this.handleColor}></Icon>
        </View>
      </Animated.View>
    );
  }

  handleColor = "black";
  style = StyleSheet.create({
    view: {
      position: 'absolute',
      width: '100%',
      zIndex: 1
    },
    handle: {
      height: 14,
      backgroundColor: '#e0e0f0',
      borderTopWidth: 1,
      borderTopColor: 'black',
      borderBottomWidth: 1,
      borderBottomColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 1
    },
    content: {
      backgroundColor: '#e8e8f8'
    }
  });

  responder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderTerminationRequest: () => true,
    onPanResponderTerminate: () => this.close(),
    onPanResponderMove: (evt, gestureState) => {
      if(!this.state.opened) {
        this.setState({
          view: {
            top: new Animated.Value(this.getPosition(gestureState.dy/this.state.contentHeight))
          }
        });
      } else {
        this.setState({
          view: {
            top: new Animated.Value(this.getPosition(1+gestureState.dy/this.state.contentHeight))
          }
        });
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if(this.state.opened){
        if(-gestureState.dy >= this.state.contentHeight/2) {
          this.close()
        } else {
          this.open();
        }
      } else {
        if(gestureState.dy >= this.state.contentHeight/2) {
          this.open()
        } else {
          this.close();
        }
      }
    }
  });
}