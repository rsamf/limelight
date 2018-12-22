import { AsyncStorage } from 'react-native';

export default class LocalArray {
  constructor(uniqueIdentifier, update) {
    this.internalStorageItem = this.stg`${uniqueIdentifier}`;
    this.update = () => update(this);
    this.getAll(list => {
      this.mockArray(list);
      this.update();
    });
  }

  stg = item => `spotlight:${item}`;

  contains(element) {
    return this.toArray().includes(element);
  }

  forEach(callback) {
    for(let i = 0; i < this.length; i++) {
      callback(this[i], i, this);
    }
  }

  pop(callback) {
    this.getAll(list => {
      list.pop();
      this.setList(list).then(()=>{
        if(callback) callback(list);
      });
    });
  }

  push(element, callback){
    this.getAll(list => {
      if(!list.includes(element)) {
        list.push(element);
        this.setList(list).then(()=>{
          if(callback) callback(list);
        });
      } else {
        if(callback) callback(list);
      }
    });
  }

  remove(element, callback) {
    this.getAll(list => {
      list.splice(list.indexOf(element), 1);
      this.setList(list).then(()=>{
        if(callback) callback(list);
      });
    });
  }

  removeAll(elements, callback) {
    this.getAll(list => {
      elements.forEach(toRemove => {
        list.splice(list.indexOf(toRemove), 1);
      });
      this.setList(list).then(()=>{
        if(callback) callback(list);
      })
    })
  }

  get(index, callback) {
    this.getAll(list => {
      if(callback) callback(list[index]);
    });
  }

  getAll(callback) {
    AsyncStorage.getItem(this.internalStorageItem, (err, list) => {
      let parsedList = (!err && list) ? JSON.parse(list) : [];
      if(callback) callback(parsedList);
    });
  }

  wipe(callback) {
    this.setList([]).then(()=>{
      if(callback) callback([]);
    });
  }

  toArray() {
    let array = new Array(this.length);
    for(let i = 0; i < this.length; i++) {
      array[i] = this[i];
    }
    return array;
  }

  mockArray(array){
    // Renew
    if(this.length) {
      for(let i = 0; i < this.length; i++) {
        delete this[i];
      }
    }
    // Rebuild
    Object.assign(this, array);
    this.length = array.length;
  }
  
  setList(list) {
    this.mockArray(list);
    this.update();
    return AsyncStorage.setItem(this.internalStorageItem, JSON.stringify(list));
  }
}