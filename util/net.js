import { NetInfo } from 'react-native';

let component;
const handleConnection = info => {
  component.setState({ isOnline: info.type !== "none" });
};
const getConnection = () => {
  NetInfo.getConnectionInfo()
    .then(handleConnection)
    .catch(() => handleConnection({ type: "none" }));
};
export default {
  init: c => {
    component = c;
    NetInfo.addEventListener('connectionChange', handleConnection);
    // setInterval(getConnection, 1000);
  },
  get: getConnection,
  getWithoutUpdate: callback => {
    NetInfo.getConnectionInfo()
      .then(callback);
  }
};