import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import Swiper from 'react-native-swiper';
import globals from './helpers';

export default class Messages extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(newProps) {
    if(newProps.ready && newProps.children.length === 0) {
      this.props.finishReading();
    }
  }

  render() {
    if(this.props.ready) {
      return (
        <Swiper showsButtons={true} loop={false}>
          {
            this.props.children.map((m, i) => {
              const slideStyle = getSlideStyle();
              const bg = slideStyle.backgroundColor;
              return (
                <View key={i} style={slideStyle}>
                  <View style={style.titleWrapper}>
                    <Text style={style.title}>{m.title}</Text>
                    {
                      m.subtitle ?
                      <Text style={style.subtitle}>{m.subtitle}</Text> :
                      <View style={style.subtitle}></View>
                    }
                  </View>
                  {
                    m.image &&
                      <Image 
                        style={getImageStyle(m.image)}
                        source={{uri: m.image.uri}}
                      /> 
                    
                  }
                  <Text style={style.content}>{m.content}</Text>
                  {
                    m.subcontent ?
                    <Text style={style.subcontent}>{m.subcontent}</Text> :
                    <View style={style.subcontent}></View>
                  }
                  {
                    i === this.props.children.length - 1 &&
                    <Icon 
                      containerStyle={style.finish}
                      name="arrow-right" 
                      type="evilicon" 
                      size={64} 
                      color={globals.sWhite}
                      underlayColor={bg}
                      onPress={()=>this.props.finishReading()}
                    />
                  }
                </View>
              )
            })
          }
        </Swiper>
      );
    } else {
      return <View/>;
    }
  }
}

const getImageStyle = (image) => {
  const MAX_HEIGHT = 250;
  const MAX_WIDTH = 200;
  if(image.height > MAX_HEIGHT) {
    let ratio = image.width / image.height;
    return {
      height: MAX_HEIGHT,
      width: Math.round(ratio * MAX_HEIGHT),
      marginBottom: 20
    };
  }
  if(image.width > MAX_WIDTH) {
    let ratio = image.height / image.width;
    return {
      height: Math.round(ratio * MAX_WIDTH),
      width: MAX_WIDTH,
      marginBottom: 20
    };
  }
  return {
    width: image.width,
    height: image.height,
    marginBottom: 20
  };
};

const getSlideStyle = () => {
  const rand = () => Math.round(Math.random()*220);
  return {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `rgb(${rand()},${rand()},${rand()})`,
    ...style.message
  };
};

const style = StyleSheet.create({
  wrapper: {
    backgroundColor: globals.sBlack
  },
  message: {
    padding: 50
  },
  titleWrapper: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold'
  },
  subtitle: {
    color: '#fff',
    fontSize: 20
  },
  image: {
    width: 141, //multiple height by .5622 to get width
    height: 250,
    marginBottom: 20   
  },
  content: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center'
  },
  subcontent: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center'
  },
  finish: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center'
  }
})