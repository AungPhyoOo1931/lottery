const app = new Vue({
    el: '#app',
    data: {
      configBetList: [],
      betList:[],
      cryle:123456,
      amount:0,
      hour:0,
      min:0,
      sec:0,
      betType:1,
    },
    mounted() {  
      this.showBetList(100);  
      this.getTime()
    },
    computed:{
      totalAmount(){
        return this.amount * this.configBetList.length
      },
      maybeWin(){
        return this.amount * 80
      },
    },
    methods: {
      showBetList(count) {
        this.betList = Array.from({ length: count }, (_, index) => ({
          id: index + 1,
          value: index,
          checked: false,
        }));
      },
      configBet() {
        this.configBetList = [];
        this.betList.forEach(item => {
          if (item.checked) {
            this.configBetList.push(item.value);
          }
        });
      },
      getTimeOut() {
        const nowTime = moment().tz('Asia/Yangon');
        const first = nowTime.clone().set({
          hour: 12,
          minute: 30,
          second: 0,
          millisecond: 0
        });
        const second = nowTime.clone().set({
          hour: 17,
          minute: 30,
          second: 0,
          millisecond: 0
        });
        const nextFirst = first.clone().add(1, 'day');
        let diffTime;
        if (nowTime.isBefore(first)) {
          diffTime = first.diff(nowTime);
        } else if (nowTime.isBefore(second)) {
          diffTime = second.diff(nowTime);
        } else {
          diffTime = nextFirst.diff(nowTime);
        }
        return diffTime;
      },
      getTime() {
        setInterval(() => {
          const diffTime = this.getTimeOut();
    
          if (diffTime <= 0) {
            this.hour = '00';
            this.min = '00';
            this.sec = '00';
            return;
          }
          const duration = moment.duration(diffTime);
          this.hour = String(duration.hours()).padStart(2, '0');
          this.min = String(duration.minutes()).padStart(2, '0');
          this.sec = String(duration.seconds()).padStart(2, '0');
        }, 1000);
      },
      reverseNum(num) {
        const str = String(num).padStart(2, '0');
        return parseInt(str.split('').reverse().join(''), 10); // join('') 而不是 join()
      },      
      choiceR(){
        if(this.betType !== 1){
          return
        }
        for(let i = 0; i < this.configBetList.length; i++){
          const newNum = this.reverseNum(this.configBetList[i])
          console.log(newNum);
          
          this.betList[newNum].checked = true
        }
      },
      choiceH(){
        this.showBetList(10)
      },
      clearConfig(){
        this.configBetList = []
      }
    }
    
  })