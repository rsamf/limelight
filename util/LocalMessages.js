import LocalArray from './LocalArray';
import globals from '../components/helpers';
import GetMessagesQuery from '../GQL/queries/GetMessages';

export default class LocalMessages extends LocalArray {
  constructor(component) {
    super("messages", () => {
      component.setState({
        messages: this
      });
    });
    this.init();
  }

  init() {
    this.unreadMessages = [];
    globals.client.query({query: GetMessagesQuery})
      .then(({data: {getMessages}}) => {
        // this.wipe(); ///
        this.getMessagesToRead(getMessages);
      })
      .catch(_ => {
        this.unreadMessages = [];
        this.ready=true;
        this.update();
      });
  }

  getMessagesToRead(aws) {
    let newMessages = this.sorted(aws);
    this.unreadMessages = newMessages.filter(message => {
      if(message.type === "WELCOME" || message.type === "ONCE") {
        return !this.contains(message.id);
      }
      if(message.type === "EVERY") {
        return true;
      }
      return false;
    });
    this.ready = true;
    this.pushAll(aws.map(a => a.id));
  }

  sorted(messages) {
    let toSort = [...messages];
    return toSort.sort((a, b) => {
      return parseInt(a.id) - parseInt(b.id);
    });
  }
}