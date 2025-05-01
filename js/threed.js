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
          sptwod:'s-2D',
          node:{
            nodeBet:{
              nodeBeth4:"Confirm bet",
              p1:"Current times",
              p2:"Drawing time",
              p4:"Bet cannot be cancelled after placing",
              config:"Confirm",
              cancle:"Cancel"
            },
            success:{
              textp:"Success!"
            },
            files:{
              textp:'Failed!'
            }
          }
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
          sptwod:'快2D',
          node:{
            nodeBet:{
              nodeBeth4:"确认下注",
              p1:"当前周期",
              p2:"开奖时间",
              p4:"下注后不可取消",
              config:"确认",
              cancle:"取消"
            },
            success:{
              textp:"成功!"
            },
            files:{
              textp:'失败!'
            }
          }
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
          sptwod:'s-3D',
          node:{
            nodeBet:{
              nodeBeth4:"အတည်ပြုပါ",
              p1:"ယခုအကြိမ်",
              p2:"ဖွင့်မည့်ချိန်",
              p4:"အတည်ပြုပြီးပါကပြန်လည်ပယ်ဖြတ်မရပါ",
              config:"အတည်ပြပါ",
              cancle:"ပယ်ဖျက်ပါ"
            },
            success:{
              textp:"အောင်မြင်ပါသည်!"
            },
            files:{
              textp:'မအောင်မြင်ပါ'
            }
          }
          
        }
      },
      node:{
        nodeShow:false,
        loadding:false,
        nodeBet:false,
        success:false,
        files:false
      },
      timeset:{
        day:0,
        hour:0,
        min:0,
        sec:0,
      },
      resultData:{},
      choiceNumber:[null],
      node:{
        nodeShow:false,
      },
      cryle:0,
      status:false,
      balance:0,
      timr:"",
      amount:0,//下注金额
      betType:5
    },
    mounted() {  
      this.getTimes()
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
        if(!this.choiceNumber[0]){
          return 0
        }
        return this.amount * 700
      }
    },
    methods: {
      opentime() {
        const now = moment().tz('Asia/Yangon');
        const year = now.year();
        const month = now.month(); // 月份从0开始
        const date = now.date();
        const hour = now.hour();
        const minute = now.minute();
      
        // 如果是每月1号12点前，返回本月1号12点
        if (date === 1 && (hour < 12 || (hour === 12 && minute === 0))) {
          return moment.tz({ year, month, day: 1, hour: 12, minute: 0 }, 'Asia/Yangon')
            .format('YYYY-MM-DD HH:mm');
        }
      
        // 如果是16号前，或16号12点前，返回本月16号12点
        if (date < 16 || (date === 16 && (hour < 12 || (hour === 12 && minute === 0)))) {
          return moment.tz({ year, month, day: 16, hour: 12, minute: 0 }, 'Asia/Yangon')
            .format('YYYY-MM-DD HH:mm');
        }
      
        // 否则（16号12点后），返回下个月1号12点
        return moment.tz({ year, month: month + 1, day: 1, hour: 12, minute: 0 }, 'Asia/Yangon')
          .format('YYYY-MM-DD HH:mm');
      },      
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
      bet(){
        clearTimeout(this.timr)
        this.timr = setTimeout(() => {
          let amount = this.amount || null
          // let totalAmount = this.amount * this.configBetList.length || null
          if(amount <= 100){
            this.nodeWin(false,'Minimum bet 100ks','最低下注100ks','အနည်းဆုံး100ကျပ်ထိုးရန်')
            return
          }
          if(!this.choiceNumber[0]){
            this.nodeWin(false,'Please select a number','请选择数字','ဂဏန်းရွေးပါ')
            return
          }
          this.node.nodeBet = true
        },300)
      },
      calcleBet(){
        this.node.nodeBet = false
      },
      async getTimes(){
        const sel = this
        async function times(){
          const gameType = sel.betType
          const res = await axios.post('https://2dmaster.com/api/getTimes', {
            gameType: gameType
          });        
          if(res.data.message === 'error'){
            sel.language.en.NodeText = "Unknown error"
            sel.language.zh.NodeText = "未知错误"
            sel.language.my.NodeText = "Unknown error"
            sel.Node()
            return
          }
          sel.cryle = res.data.times
        }
        times()
        // setInterval(times(),5000)
      },
      async configBetBtn(){
        try{
          this.node.nodeBet = false
          this.node.loadding = true
          const userData = JSON.parse(localStorage.getItem('loginData'))
          const token = userData.token 
          const username = userData.username
          const res = await axios.post('https://2dmaster.com/api/bet', {
           amount:this.amount,
           betType:this.betType,
           betList:this.choiceNumber,
           username:username,
           gameTimes:this.cryle,
           opentime:this.opentime()
             }, 
             {
               headers: {
                 Authorization: `Bearer ${token}`  // 通常是这样写
               },
               timeout:5000
             });
             this.node.loadding = false
           const data = res.data
           console.log(data);
           if(!data.msg){
            this.nodeWin(false,'error','未知错误','error')
             return
           }
           const status = data.code
           if(status === 403){
            this.nodeWin(false,'error','未知错误','error')
             return
           }else if(status === 405){
            this.nodeWin(false,'This bet is closed','此周期投注已关闭','၄င်းအကြိမ်ပိတ်နေပါသည်')
            return
           }else if(status === 406){
            this.nodeWin(false,'Insufficient balance','余额不足','လက်ကျန်ငွေမလုံလောက်ပါ')
            return
           }else if(status === 404){
            this.nodeWin(false,'The login status is abnormal. Please log in again.','登录状态异常请重新登录','The login status is abnormal. Please log in again.')
            setTimeout(() => {
              window.location.href = './login.html'
            }, 2000);
            return
          }
           this.nodeWin(true,'Success','成功','အောင်မြင်ပါသည်')
  
        }catch(err){
          console.log(err);
          
          this.nodeWin(false,'Network error, please try again','网络异常','Network error, please try again')
          return
        }
         
      },
      BetcheckLogin(){
        const token = JSON.parse(localStorage.getItem('loginData')) || null
        if(!token || !token.token){
          this.nodeWin(false,'Please log in','请登录','Please log in')
          setTimeout(() => {
            window.location.href = './login.html'
          }, 2000);
            return
        }
        this.bet()
      },
      nodeWin(success,ent,zht,mmt){     
        if(success){
          this.language.zh.node.success.textp = zht
          this.language.en.node.success.textp = ent
          this.language.my.node.success.textp = mmt
          this.node.loadding = false
          this.node.success = true
        }else{
          this.language.zh.node.files.textp = zht
          this.language.en.node.files.textp = ent
          this.language.my.node.files.textp = mmt
          this.node.loadding = false
          this.node.files = true
        }
      }
    }
})