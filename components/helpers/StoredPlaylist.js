import { AsyncStorage } from 'react-native';

export default class StoredPlaylist {
  constructor() {
    this.item = this.stg`list`;
  }

  stg = item => `spotlight:${item}`;

  async pop(callback) {
    let list = await this.getAll();
    let playlist = list.pop();
    this.setList(list).then(()=>{
      if(callback) callback(playlist);
    });
    return playlist;
  }

  async push(playlistId, callback){
    let list = await this.getAll();
    if(!list.includes(playlistId)) {
      list.push(playlistId);
      this.setList(list).then(()=>{
        if(callback) callback();
      });
    }
  }

  async remove(playlistId, callback) {
    let list = await this.getAll();
    console.warn(list.length);
    let playlist = list.splice(list.indexOf(playlistId), 1)[0];
    this.setList(list).then(()=>{
      if(callback) callback(playlist);
    });
    return playlist;
  }

  async get(index, callback) {
    let list = await this.getAll();
    if(callback) callback(list[index]);
    return list[index];
  }

  async getAll(callback) {
    let list = await AsyncStorage.getItem(this.item);
    let parsedList = JSON.parse(list);
    if(callback) callback(parsedList);
    return parsedList;
  }

  setList(list) {
    return AsyncStorage.setItem(this.item, JSON.stringify(list));
  }
}
