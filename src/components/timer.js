import React from 'react'

class Timer extends React.Component {

  constructor(props){
    super(props);
    this.state ={
      seconds: 5400,
    }
  }

  tick = () => {
    const { seconds } = this.state;
    this.setState({
      seconds: seconds -1
    })
  };

  componentWillMount(){
    let seconds = localStorage.getItem('timeLength');
    console.log(seconds)
    if(!seconds){
      alert(1)
      localStorage.setItem('timeLength',this.state.seconds)
    }else {
      this.setState({seconds})
    }
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  renderTime(){
    let time = this.state.seconds;
    let hours = parseInt(time/60/60); //计算剩余的小时
    let minutes = parseInt(time % 3600 /60);//计算剩余的分钟
    let seconds = parseInt(time % 3600 % 60);//计算剩余的秒数
    hours = this.checkTime(hours);
    minutes = this.checkTime(minutes);
    seconds = this.checkTime(seconds);

    return <div>{hours+"小时" + minutes+"分"+seconds+"秒"}</div>
  }

  checkTime(i){ //将0-9的数字前面加上0，例1变为01
    if(i<10)
    {
      i = "0" + i;
    }
    return i;
  }
  render() {
    return (
      <div>还剩:{this.renderTime()}</div>
    )
  }
}
export default Timer;
