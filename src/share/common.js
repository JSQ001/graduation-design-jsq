/**
 * Created by zaranengap on 2017/7/13.
 */
Array.prototype.delete = function(item){
  for(let i = 0; i < this.length; i++){
    if(this[i] === item){
      this.splice(i, 1);
      return i;
    }
  }
  return -1;
};

Array.prototype.addIfNotExist = function(item){
  for(let i = 0; i < this.length; i++){
    if(this[i] === item)
      return;
  }
  this.push(item)
};
