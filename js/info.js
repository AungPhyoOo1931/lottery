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
          betHistory:{
            name:{a:"Thai2D-choose",b:"Thai2D-Header",c:"Thai2D-tail",d:"Thai3D"},
            time:"Times",
            amount:"Bet Amount",
            number:"Bet Number",
            resultNum:"Result",
            opentime:"Open Time",
            join_time:"Join Tim",
            false:"Lose",
            win:"Win",
            unow:"No prizes awarded",
            result:"Result",
            bet:" chance"

          },
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
          betHistory:{
            name:{a:"泰国2D-单选",b:"泰国2D-字头",c:"泰国2D-字尾",d:"泰国3D"},
            time:"周期",
            amount:"投注金额",
            number:"投注号码",
            resultNum:"开奖号码",
            opentime:"开奖时间",
            join_time:"投注时间",
            false:"输",
            win:"赢",
            unow:"未开奖",
            result:"结果",
            bet:"赔率"

          },
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
          betHistory:{
            name:{a:"Thai2D",b:"Thai2D-ထိပ်",c:"Thai2D-ပိတ်",d:"Thai3D"},
            time:"ကြိမ်",
            amount:"ထိုးငွေ",
            number:"နံပါတ်",
            resultNum:"ဖွင့်သည့်နံပါတ်",
            opentime:"ဖွင့်ချိန်",
            join_time:"ထိုးချိန်",
            false:"ရှုံး",
            win:"နိုင်",
            unow:"မဖွင့်သေးပါ",
            result:"Result",
            bet:"အဆ"

          },
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
      data:[],
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
        this.BetcheckLogin()
      let lang = document.documentElement.lang;
      const newLang = localStorage.getItem('lang') || lang
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
     
      BetcheckLogin(){
        const token = JSON.parse(localStorage.getItem('loginData')) || null
        if(!token || !token.token){
          this.nodeWin(false,'Please log in','请登录','Please log in')
          setTimeout(() => {
            window.location.href = './login.html'
          }, 2000);
            return
        }
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