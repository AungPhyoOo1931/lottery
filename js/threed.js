const app = new Vue({
    el: '#app',
    data: {
      lang:'',
      language:{
        en:{
          title:'Lottery Master',
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
          NodeText : "",
          day:"day",
          hour:"hour",
          min:"minute",
          sec:"seconds",
          twod:'thai2D',
          threed:'thai3D',
          sptwod:'s-2D'
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
          NodeText : "",
          day:"天",
          hour:"小时",
          min:"分钟",
          sec:"秒",
          twod:'泰国2D',
          threed:'泰国3D',
          sptwod:'快2D'
        },
        my:{
          title:'Lottery Master',
          times:'ယခုကြိမ်နူန်း:',
          stopTime:'ကြိမ်ထိုးခြင်းပိတ်ရန်',
          choice:"ရွေးမည်",
          rxuan:'Rမည်',
          head:'ထိပ်စည်း',
          floot:'နောက်ပိတ်',
          selectNumber:'ရွေးချယ်ထားသည့်နံပါတ်',
          betAmount:'ထိုးကြေး:',
          totalBetAmount:'စုစုပေါင်းထိုးကြေး:',
          potentialProfit:"အနိုင်ရပါက:",
          configBet:"သေချပါသည်",
          game:"ဂိမ်းများ",
          history:"သမိုင်း",
          post:"ကြေညာချက်",
          info:"အကောင့်",
          NodeText : "",
          day:"ရက်",
          hour:"နာရီ",
          min:"မိနစ်",
          sec:"စက္ကန့်",
          twod:'ထိုင်း2D',
          threed:'ထိုင်း3D',
          sptwod:'s-3D'
        }
      },
      timeset:{
        day:0,
        hour:0,
        min:0,
        sec:0,
      },
      resultData:{},
      choiceNumber:'',
      node:{
        nodeShow:false,
      },
      status:false,
      balance:0,
      timr:"",
      amount:0,//下注金额
    },
    mounted() {  
      this.getTime()
      this.getHistory()
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
        return this.language[this.lang] || {};
      },
      totalBet(){
        return this.amount
      },
      maybeWin(){
        if(this.choiceNumber === ''){
          return 0
        }
        return this.amount * 700
      }
    },
    methods: {
      async getHistory(){
        const res = await axios.get('https://api.2dboss.com/api/v2/v1/2dstock/threed-result')
        const data = res.data
        console.log(data);
        this.resultData = data.data
        console.log(this.resultData);
        
      },
      getTimeOut() {
        const nowTime = moment().tz('Asia/Yangon');
      
        // 本月1号和16号的 12:00
        let firstDay = nowTime.clone().set({ date: 1, hour: 12, minute: 0, second: 0, millisecond: 0 });
        let midDay = nowTime.clone().set({ date: 16, hour: 12, minute: 0, second: 0, millisecond: 0 });
      
        let target;
      
        if (nowTime.isBefore(firstDay)) {
          // 当前时间 < 本月1号12:00，目标是本月1号
          target = firstDay;
        } else if (nowTime.isBefore(midDay)) {
          // 当前时间在 1号 和 16号之间
          target = midDay;
        } else {
          // 当前时间在16号之后，目标是下个月1号
          target = firstDay.add(1, 'month');
        }
      
        return target.diff(nowTime);
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
    }
})