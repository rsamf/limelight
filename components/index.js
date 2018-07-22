import { StyleSheet } from 'react-native';

const sGreen = '#84bd00',
      sBlack = '#000000',
      sGrey = '#828282',
      sSand = '#ecebe8',
      sWhite = '#ffffff';

const style = StyleSheet.create({
  view: {
    backgroundColor: 'black',
    flex: 1
  },
  text: {
    color: sWhite,
    fontFamily: 'Futura',
    fontSize: 24
  },
  smallText:{
    color: sSand,
    fontFamily: 'Futura',
    fontSize: 16
  },
  barHop: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    margin: 10
  }
});

let user = null;

const globals = {
  style,
  sGreen,
  sBlack,
  sGrey,
  sSand,
  sWhite,
  user
};

export default globals;
