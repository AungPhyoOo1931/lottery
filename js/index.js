const app = new Vue({
    el: '#app',
    data: {
      lang:'',
      language:{
        en:{
          title:'Lottery Manager',
          times:'times:',
          stopTime:'times Stop betting countdown',
          choice:"choose",
          rxuan:'R',
          head:'Header',
          floot:'Tail',
          selectNumber:'Selected number',
          betAmount:'Bet Amount:',
          totalBetAmount:'Total Bet Amount:',
          potentialProfit:"Potential Profit:",
          configBet:"Confirm bet",
          game:"Game",
          history:"History",
          post:"post",
          info:"Account",
        },
        zh:{
          title:'彩票大师',
          times:'当前周期:',
          stopTime:'期停止下注倒计时',
          choice:"单选",
          rxuan:'R选',
          head:'字头',
          floot:'字尾',
          selectNumber:'选中号码',
          betAmount:'下注金额:',
          totalBetAmount:'总下注金额:',
          potentialProfit:"潜在盈利:",
          configBet:"确认下注",
          game:"游戏",
          history:"历史",
          post:"公告",
          info:"我的",
        },
        my:{
          title:'Lottery Manager',
          times:'ယခုကြိမ်နူန်း:',
          stopTime:'ကြိမ်ထိုးခြင်းပိတ်ရန်',
          choice:"ရွေးမည်",
          rxuan:'Rမည်',
          head:'ဆယ်ဂဏန်း',
          floot:'ခုဂဏန်း',
          selectNumber:'ရွေးချယ်ထားသည့်နံပါတ်',
          betAmount:'ထိုးကြေး:',
          totalBetAmount:'စုစုပေါင်းထိုးကြေး:',
          potentialProfit:"အနိုင်ရပါက:",
          configBet:"သေချပါသည်",
          game:"ဂိမ်းများ",
          history:"သမိုင်း",
          post:"ကြေညာချက်",
          info:"အကောင့်",
        }
      },
      liveInfo:{
        server_time:'--',
        cryle:123456,
        live:{
          set:"--",
          value:"--",
          time:"--",
          twod:"--",
        },
        liveHistory:[
            {set:12345.01,value:12345.01,num:45},
            {set:12345.11,value:12345.11,num:11}
           ]
        },
      timeset:{
        day:0,
        hour:0,
        min:0,
        sec:0,
      },
      node:{
        nodeShow:false,
        text:"余额不足!!!"
      },
      configBetList: [],
      betList:[],
      amount:0,
      betType:1,
    },
    mounted() {  
      this.showBetList(100);  
      this.getTime()
      this.show2DLive()
      let lang = document.documentElement.lang;
      const newLang = localStorage.getItem('lang') || null
      if(newLang){
        document.documentElement.lang = newLang
        this.lang = newLang
      }else{
        this.lang = 'en'
        localStorage.setItem('lang',this.lang)
      }
    },
    computed:{
      text() {
        return this.language[this.lang];
      },
      totalAmount(){
        return this.amount * this.configBetList.length
      },
      maybeWin(){
        if(this.configBetList.length === 0){
          return 0
        }
        if(this.betType === 1){
            return (this.amount || 0) * 80
        }else{
            return (this.amount || 0) * 8
        }
      },
    },
    methods: {
      setLang(){
        localStorage.setItem('lang',this.lang)
      },
      async show2DLive(){
        const timeset = setInterval(async() => {
          const nowTime = moment().tz('Asia/Yangon')
          const res = await axios.get('https://api.thaistock2d.com/live')
          const data = res.data
          const live = this.liveInfo
          live.live = data.live
          if(data.holiday.status === "3"){
            live.twod = data.result[3].twod
            live.server_time = data.result[3].stock_datetime
            return
          }
          live.server_time = data.server_time
          live.liveHistory[0].set = data.result[1].set
          live.liveHistory[0].value = data.result[1].value
          live.liveHistory[0].num = data.result[1].twod
          live.liveHistory[1].set = data.result[3].set
          live.liveHistory[1].value = data.result[3].value
          live.liveHistory[1].num = data.result[3].twod
          if(nowTime.hour() === 12){
            live.server_time = data.result[1].stock_datetime
            live.live.twod = data.result[1].twod
          }else if(nowTime.hour() === 16){
            live.server_time = data.result[3].stock_datetime
            live.live.twod = data.result[3].twod
          }

        },5000) 
      },
      showBetList(count) {
        this.betList = Array.from({ length: count }, (_, index) => ({
          id: index + 1,
          value: index,
          checked: false,
        }));
      },
      configBet() {
        
        this.betList = this.betList
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
          hour: 11,
          minute: 45,
          second: 0,
          millisecond: 0
        });
        const second = nowTime.clone().set({
          hour: 15,
          minute: 45,
          second: 0,
          millisecond: 0
        });
        let diffTime;
        const day = nowTime.day();
        let nextFirst = first.clone().add(1, 'day');
        if (day === 0) {
          nextFirst = first.clone().add(1, 'day');
          diffTime = nextFirst.diff(nowTime);
        } else if(day === 6){
          nextFirst = first.clone().add(2, 'day');
          diffTime = nextFirst.diff(nowTime);
        }else if (nowTime.isBefore(first)) {
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
          this.timeset.day = String(duration.days()).padStart(2, '0');
          this.timeset.hour = String(duration.hours()).padStart(2, '0');
          this.timeset.min = String(duration.minutes()).padStart(2, '0');
          this.timeset.sec = String(duration.seconds()).padStart(2, '0');
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
      choiceT(){
        this.showBetList(10)
      },
      clearConfig(){
        this.configBetList = []
      }
    }
    
  })