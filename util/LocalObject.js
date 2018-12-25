import { AsyncStorage } from 'react-native';

export default class LocalObject {
  constructor(uniqueIdentifier, update, callback) {
    this.internalStorageItem = this.stg`${uniqueIdentifier}`;
    this.update = () => update(this);
    this.getAll(obj => {
      this.mockObject(obj);
      callback();
    });
  }

  stg = item => `spotlight:${item}`;

  contains(key) {
    return this[key] ? true : false;
  }

  forEach(func) {
    const entries = Object.entries();
    for(let i = 0; i < entries.length; i++) {
      func(entries[i][0], entries[i][1], i);
    }
  }

  get(key) {
    return this[key];
  }

  delete(key, callback) {
    this.getAll(obj => {
      delete obj[key];
      this.setObject(obj).then(()=>{
        if(callback) callback(obj);
      });
    });
  }

  set(key, value, callback) {
    this.getAll(obj => {
      obj[key] = value;
      this.setObject(obj).then(()=>{
        if(callback) callback(obj);
      });
    });
  }


  getAll(callback) {
    AsyncStorage.getItem(this.internalStorageItem, (err, obj) => {
      let parsedObj = (!err && obj) ? JSON.parse(obj) : {};
      if(callback) callback(parsedObj);
    });
  }

  mockObject(obj){
    // Renew
    if(this.trackedKeys) {
      for(let i = 0; i < this.trackedKeys.length; i++) {
        delete this[this.trackedKeys[i]];
      }
    }
    // Rebuild
    Object.assign(this, obj);
    this.trackedKeys = Object.keys(obj);
  }
  
  setObject(obj) {
    this.mockObject(obj);
    this.update();
    return AsyncStorage.setItem(this.internalStorageItem, JSON.stringify(obj));
  }

  wipe(callback) {
    this.setObject({}).then(()=>{
      if(callback) callback({});
    });
  }
}