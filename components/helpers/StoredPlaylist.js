import { AsyncStorage } from 'react-native';

export default class StoredPlaylist {
  constructor() {
    this.item = this.stg`list`;
  }

  stg = item => `spotlight:${item}`;

  pop(callback) {
    this.getAll(list => {
      list.pop();
      this.setList(list).then(()=>{
        if(callback) callback(list);
      });
    });
  }

  push(playlistId, callback){
    this.getAll(list => {
      if(!list.includes(playlistId)) {
        list.push(playlistId);
        this.setList(list).then(()=>{
          if(callback) callback(list);
        });
      }
      if(callback) callback(list);
    });
  }

  remove(playlistId, callback) {
    this.getAll(list => {
      list.splice(list.indexOf(playlistId), 1);
      this.setList(list).then(()=>{
        if(callback) callback(list);
      });
    });
  }

  get(index, callback) {
    this.getAll(list => {
      if(callback) callback(list[index]);
    });
  }

  getAll(callback) {
    AsyncStorage.getItem(this.item, (err, list) => {
      let parsedList = (!err && list) ? JSON.parse(list) : [];
      if(callback) callback(parsedList);
    });
  }

  wipe(callback) {
    this.setList([]).then(()=>{
      if(callback) callback([]);
    });
  }
  
  setList(list) {
    return AsyncStorage.setItem(this.item, JSON.stringify(list));
  }
}
