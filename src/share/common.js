/**
 * Created by zaranengap on 2017/7/13.
 */
import React from 'react'
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

//金额过滤
React.Component.prototype.filterMoney = money => <span className="money-cell">{(money || 0).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</span>;
