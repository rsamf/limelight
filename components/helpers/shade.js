import Popout from './popout';

export default class extends Popout {
  constructor(props){
    super(props);

    this.handleColor = "white";
    this.style.handle = {
      ...this.style.handle,
      backgroundColor: 'rgba(30,30,30,.8)',
      borderTopColor: 'rgba(20,20,20,1)',
      borderBottomColor: 'rgba(30,30,30,.8)',
    };
    this.style.content = {
      ...this.style.content,
      backgroundColor: 'rgba(20,20,20,.9)'
    }
  }
}