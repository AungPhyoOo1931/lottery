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
          NodeText : ""
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
          NodeText : ""
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
          NodeText : ""
        }
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
      status:false,
      balance:0,
      timr:"",
      amount:0,//下注金额
      betType:1,//玩法1:单选,2:字头,3:自慰
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
      setLang(){
        localStorage.setItem('lang',this.lang)
      },
      async show2DLive() {
        const self = this // 保存当前作用域的 this
      
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
          this.status = false
          if (nowTime.hour() === 12) {
            live.server_time = data.result[1].stock_datetime
            live.live.twod = data.result[1].twod
            this.status = true
          } else if (nowTime.hour() === 16) {
            live.server_time = data.result[3].stock_datetime
            live.live.twod = data.result[3].twod
            this.status = true
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
        },300)
      },
      Node(){
        this.node.nodeShow = true
        setTimeout(() => {
          this.node.nodeShow = false
        }, 3000);
      }
    }
    
  })