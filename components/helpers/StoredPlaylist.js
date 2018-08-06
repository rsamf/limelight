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
        callback(list);
      });
    });
  }

  push(playlistId, callback){
    this.getAll(list => {
      if(!list.includes(playlistId)) {
        list.push(playlistId);
        this.setList(list).then(()=>{
          callback(list);
        });
      }
    });
  }

  remove(playlistId, callback) {
    this.getAll(list => {
      list.splice(list.indexOf(playlistId), 1);
      this.setList(list).then(()=>{
        callback(list);
      });
    });
  }

  get(index, callback) {
    this.getAll(list => {
      callback(list[index]);
    });
  }

  getAll(callback) {
    AsyncStorage.getItem(this.item, (err, list) => {
      let parsedList = (!err && list) ? JSON.parse(list) : [];
      callback(parsedList);
    });
  }

  wipe(callback) {
    this.setList([]).then(()=>{
      callback([]);
    });
  }
  
  setList(list) {
    return AsyncStorage.setItem(this.item, JSON.stringify(list));
  }
}
