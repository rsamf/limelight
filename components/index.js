import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  view: {
    backgroundColor: 'black',
    flex: 1
  },
  text: {
    color: 'white',
    fontFamily: 'Futura',
    fontSize: 24
  },
  barHop: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    margin: 10
  }
});

const sGreen = '#84bd00',
      sBlack = '#000000',
      sGrey = '#828282',
      sSand = '#ecebe8',
      sWhite = '#ffffff';

const globals = {
  style,
  sGreen,
  sBlack,
  sGrey,
  sSand,
  sWhite
};

export default globals;
