import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Swiper from 'react-native-swiper';

export default class Messages extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if(this.props.ready) {
      return (
        <Swiper showsButtons={true} loop={false}>
          {
            this.props.children.map((m, i) => (
              <View key={i} style={getSlideStyle()}>
                <Text style={style.title}>{m.title}</Text>
                {
                  m.subtitle &&
                  <Text style={style.subtitle}>{m.subtitle}</Text>
                }
                {
                  m.content &&
                  <Text style={style.content}>{m.content}</Text>
                } 
                {
                  m.subContent &&
                  <Text style={style.subContent}>{m.subContent}</Text>
                }
              </View>
            ))
          }
        </Swiper>
      );
    } else {
      return <View/>;
    }
  }
}

const getSlideStyle = () => {
  const rand = () => Math.round(Math.random()*220);
  return {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `rgb(${rand()},${rand()},${rand()})`
  };
}

const style = StyleSheet.create({
  wrapper: {
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#fff',
    fontSize: 24,
  },
  content: {
    color: '#fff',
    fontSize: 18,
  },
  subContent: {
    color: '#fff',
    fontSize: 12,
  }
})