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
        configText:'times confirm bet',
        configTitle:'Please confirm',
        configBtn:'OK',
        cancleBtn:'cancel'
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
        configText:'期下注',
        configTitle:'请确认',
        configBtn:'确认',
        cancleBtn:'取消'
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
        configText:'ကြိမ်အတွက်ထိုးမည်',
        configTitle:'အတည်ပြုပါ',
        configBtn:'OK',
        cancleBtn:'cancel'
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
    },
    openTime:'',
    status:false,
    balance:10000000,
    timr:"",
    configBetList: [],//选中号码
    betList:[],//渲染号码按钮
    amount:0,//下注金额
    betType:1,//玩法1:单选,2:字头,3:自尾
    canBet:0
  },
  mounted() {  
    this.getTimes()
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
      return this.language[this.lang] || {};
    },
    totalAmount(){
      return this.amount * this.configBetList.length
    },
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
        }else if(weekday === 0){
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
    async show2DLive() {
      const self = this // 保存当前作用域的 this
      this.getTimes()
      async function temp() {
        const nowTime = moment().tz('Asia/Yangon')
        const res = await axios.get('https://api.thaistock2d.com/live')
        const data = res.data
        const live = self.liveInfo // 使用外层的 this
    
        live.live = data.live
    
        if (data.holiday.status === "3") {
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
        self.status = false
        if (nowTime.hour() === 12 && data.result[1].history_id) {
          live.server_time = data.result[1].stock_datetime
          live.live.twod = data.result[1].twod
          self.status = true
        } else if ((nowTime.hour() === 16 || nowTime.hour() === 17) && data.result[3].history_id) {
          console.log(1);
          
          live.server_time = data.result[3].stock_datetime
          live.live.twod = data.result[3].twod
          self.status = true
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
    },
    async getTimes(){
      const gameType = this.betType
      const res = await axios.post('https://2dmaster.com/api/getTimes', {
        gameType: gameType
      });        
      if(res.data.message === 'error'){
        this.language.en.NodeText = "Unknown error"
        this.language.zh.NodeText = "未知错误"
        this.language.my.NodeText = "Unknown error"
        this.Node()
        return
      }
      this.liveInfo.cryle = res.data.times
    },
    bet(){
      clearTimeout(this.timr)
      this.timr = setTimeout(() => {
        let amount = this.amount || null
        let totalAmount = this.amount * this.configBetList.length || null
        if(amount <= 100){
          this.language.en.NodeText = "Minimum bet 100ks"
          this.language.zh.NodeText = "最低下注100ks"
          this.language.my.NodeText = "အနည်းဆုံး100ကျပ်ထိုးရန်"
          this.Node()
          return
        }
        if(this.configBetList.length <= 0){
          this.language.en.NodeText = "Please select a number"
          this.language.zh.NodeText = "请选择数字"
          this.language.my.NodeText = "ဂဏန်းရွေးပါ"
          this.Node()
          return
        }
        if(this.balance < totalAmount){
          this.language.en.NodeText = "Insufficient balance"
          this.language.zh.NodeText = "余额不足"
          this.language.my.NodeText = "လက်ကျန်ငွေမလုံလောက်ပါ"
          this.Node()
          return
        }
        this.windows()
      },300)
    },
    Node(){
      this.node.nodeShow = true
      setTimeout(() => {
        this.node.nodeShow = false
      }, 3000);
    },
    //弹窗
    showAlert({
      title = '提示',
      text = '',
      icon = 'info',
      showCancel = false,
      confirmText = '确定',
      cancelText = '取消',
      onConfirm = null
    }) {
      Swal.fire({
        title,
        text,
        icon,
        showCancelButton: showCancel,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
      }).then((result) => {
        if (result.isConfirmed && typeof onConfirm === 'function') {
          onConfirm(); // 调用你传进来的回调
        }
      });
    },    
    windows(){
      const betData = this
      this.showAlert({
        title: this.text.configTitle,
        text: `${this.liveInfo.cryle}${this.text.configText}`,
        icon: 'warning',
        showCancel: true,
        confirmText: this.text.configBtn,
        cancelText: '取消',
        onConfirm: async () => {
         const userData = JSON.parse(localStorage.getItem('loginData'))
         const token = userData.token
         const username = userData.username
         const res = await axios.post('https://2dmaster.com/api/bet', {
          amount:betData.amount,
          betType:betData.betType,
          betList:betData.configBetList,
          username:username,
          gameTimes:betData.liveInfo.cryle,
          opentime:betData.opentime
            }, {
              headers: {
                Authorization: `Bearer ${token}`  // 通常是这样写
              }
            });
          const data = res.data
          console.log(data);
          if(!data.msg){
            betData.language.en.NodeText = "Insufficient balance"
            betData.language.zh.NodeText = "下注失败"
            betData.language.my.NodeText = "လက်ကျန်ငွေမလုံလောက်ပါ"
            betData.Node()
            return
          }
          betData.language.en.NodeText = "Insufficient balance"
          betData.language.zh.NodeText = "下注成功"
          betData.language.my.NodeText = "လက်ကျန်ငွေမလုံလောက်ပါ"
          betData.Node()

        }
      });
    },
    checkLogin(){
      const token = localStorage.getItem('loginData') || null
      if(!token){
        this.language.en.NodeText = "Please login"
          this.language.zh.NodeText = "请登录"
          this.language.my.NodeText = "Please login"
          this.Node()
          return
      }
      this.bet()
    }
  }
  
})