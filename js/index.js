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
        NodeText : "",
        day:"day",
        hour:"hour",
        min:"minute",
        sec:"seconds",
        twod:'thai2D',
        threed:'thai3D',
        sptwod:'s-2D',
        history:'history',
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
        history:'历史',
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
        title:'Lottery Manager',
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
        history:'သမိုင်း',
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
    liveHistory:[],
    node:{
      nodeShow:false,
      loadding:false,
      nodeBet:false,
      success:false,
      files:false
    },
    openTime:'',
    status:false,
    balance:10000000,
    timr:"",
    configBetList: [],//选中号码
    betList:[],//渲染号码按钮
    amount:0,//下注金额
    betType:1,//玩法1:单选,2:字头,3:自尾
    canBet:0,
    is_close_day:0,
  },
  mounted() {  
    this.node.loadding = true
    
    this.showBetList(100);  
    this.getTime()
    this.show2DLive()
    this.get2DHistroy()
    let lang = document.documentElement.lang;
    const newLang = localStorage.getItem('lang') || null
    if(newLang){
      document.documentElement.lang = newLang
      this.lang = newLang
    }else{
      this.lang = 'en'
      localStorage.setItem('lang',this.lang)
    }
    this.node.loadding = false
  },
  computed:{
    text() {
      return this.language[this.lang] || {};
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
    opentime(){
      // 当前时间（缅甸时间）
      let openTime;
        const now = moment().tz('Asia/Yangon');
        // 获取当前小时和分钟
        const hour = now.hour();
        const minute = now.minute();
        // 判断是否在 11:30 之前
        const isBefore1130 = (hour < 11) || (hour === 11 && minute < 30);
        // 判断是否在 11:30 - 15:45 之间
        const isBetween1130And1545 = (
          (hour > 11 || (hour === 11 && minute >= 30)) &&
          (hour < 15 || (hour === 15 && minute <= 45))
        );
        const isAfter1545 = (hour > 15) || (hour === 15 && minute > 45);
        // 判断是否是周五/六/日
        const weekday = now.day(); // 0 是星期日，1 是星期一，...，5 是星期五，6 是星期六
        if(weekday === 5 && isAfter1545){
          openTime = moment().tz('Asia/Yangon').add(3, 'days').set({
            hour: 12,
            minute: 1,
            second: 0,
            millisecond: 0
          });
        }else if(weekday === 6){
          openTime = moment().tz('Asia/Yangon').add(2, 'days').set({
            hour: 12,
            minute: 1,
            second: 0,
            millisecond: 0
          });
        }else if(weekday === 0 || this.is_close_day === 1){
          openTime = moment().tz('Asia/Yangon').add(1, 'days').set({
            hour: 12,
            minute: 1,
            second: 0,
            millisecond: 0
          });
        }else if(isBefore1130){
          openTime = moment().tz('Asia/Yangon').set({
            hour: 12,
            minute: 1,
            second: 0,
            millisecond: 0
          });
        }else if(isBetween1130And1545){
          openTime = moment().tz('Asia/Yangon').set({
            hour: 16,
            minute: 30,
            second: 0,
            millisecond: 0
          });
        }else{
          openTime = moment().tz('Asia/Yangon').add(1, 'days').set({
            hour: 12,
            minute: 1,
            second: 0,
            millisecond: 0
          });
        }
        return moment(openTime).format('YYYY-MM-DD HH:mm')
    },
    setLang(){
      localStorage.setItem('lang',this.lang)
    },
    async show2DLive() {
      const self = this // 保存当前作用域的 this
      
      async function temp() {
        self.getTimes()
        const nowTime = moment().tz('Asia/Yangon')
        const res = await axios.get('https://luke.2dboss.com/api/luke/twod-result-live')
        const data = res.data.data
        const live = self.liveInfo // 使用外层的 this
    
        // live.live = data.live
        self.is_close_day = data.is_close_day
        if (data.is_close_day === 1) {
          live.live.twod = data.result_430
          live.server_time = data.time_430
          live.liveHistory[0].set = data.set_1200
          live.liveHistory[0].value = data.val_1200
          live.liveHistory[0].num = data.result_1200
          live.liveHistory[1].set = data.set_430
          live.liveHistory[1].value = data.val_430
          live.liveHistory[1].num = data.result_430
          self.status = true
          return
        }
        
          live.liveHistory[0].set = data.set_1200
          live.liveHistory[0].value = data.val_1200
          live.liveHistory[0].num = data.result_1200
          live.liveHistory[1].set = data.set_430
          live.liveHistory[1].value = data.val_430
          live.liveHistory[1].num = data.result_430
          self.status = false
          live.server_time = data.current_time
          live.live.twod = data.live
          const myanmarTime = moment().tz('Asia/Yangon');
const currentHour = myanmarTime.hour();   // 小时
const currentMinute = myanmarTime.minute(); // 分钟
          if(data.status_1200 === "backend" && currentHour === 12){
            self.status = true
            live.server_time = data.time_1200
          }
           if(data.status_430 === "backend" && currentHour === 16){
            self.status = true
            live.server_time = data.time_430
          }else{
            self.status = false
          }
      }
    
      await temp()
      setInterval(temp, 5000)
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
      if (day === 0 || this.is_close_day === 1) {      
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
      this.configBet()
    },
    choiceH(){
      this.showBetList(10)
    },
    choiceT(){
      this.showBetList(10)
    },
    clearConfig(){
      this.configBetList = []
    },
    async getTimes(){
      const sel = this
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
        sel.liveInfo.cryle = res.data.times
      // setInterval(times(),5000)
    },
    bet(){
      clearTimeout(this.timr)
      this.timr = setTimeout(() => {
        let amount = this.amount || null
        let totalAmount = this.amount * this.configBetList.length || null
        if(amount <= 100){
          this.nodeWin(false,'Minimum bet 100ks','最低下注100ks','အနည်းဆုံး100ကျပ်ထိုးရန်')
          return
        }
        if(this.configBetList.length <= 0){
          this.nodeWin(false,'Please select a number','请选择数字','ဂဏန်းရွေးပါ')
          return
        }
        this.node.nodeBet = true
      },300)
    },
    Node(){
      this.node.nodeShow = true
      setTimeout(() => {
        this.node.nodeShow = false
      }, 3000);
    },
    calcleBet(){
      this.node.nodeBet = false
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
         betList:this.configBetList,
         username:username,
         gameTimes:this.liveInfo.cryle,
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

      }catch{
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
    async get2DHistroy(){
      const res = await axios.get('https://api.thaistock2d.com/2d_result')
      const data = res.data
      let tempArr = data
      .filter((item, index) => index !== 0)  // 先过滤掉第一个
      .map((item, index) => {
        return {
          date:item.date,
          result:[{
            time:item.child[1].time,
            set:item.child[1].set,
            value:item.child[1].value,
            twod:item.child[1].twod
          },
          {
            time:item.child[item.child.length - 1].time,
            set:item.child[item.child.length - 1].set,
            value:item.child[item.child.length - 1].value,
            twod:item.child[item.child.length - 1].twod
          }
        ],
        }
      });
      this.liveHistory = tempArr
      console.log(tempArr);
      
    },
    //封装弹窗函数
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