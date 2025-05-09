const app = new Vue({
    el: '#app',
    data: {
      lang:'',
      language:{
        zh:{
          title:'彩票大师',
          times:'当前周期:',
          betHistory:{
            name:{a:"泰国2D-单选",b:"泰国2D-字头",c:"泰国2D-字尾",d:"泰国3D"},
          },
          game:"游戏",
          history:"历史",
          post:"公告",
          info:"我的",
          NodeText : "",
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
      },
      userInfo:{
        userid:'',
        username:'',
        userBalance:'',
        userinvBalance:''
      },
      windows:{
        bank:false,
        topUp:false,
        withdrawa:false,
        temp:false,
        changePassword:false,
        cosutomer:false,
        inverRecord:false,
        record:false,
        main:true
      },
      topUpData:{
        topUpType:'',
        name:'',
        num:'',
        inName:'',
        inNumber:'',
        fiveDid:'',
        amount:1000,
        status:0
      },
      tempData:{
        totalPoint:'',
        totalIn:'',
        totalOut:'',
        data:''
      },
      username:'',
      token:'',
      node:{
        nodeShow:false,
        loadding:false,
        nodeBet:false,
        success:false,
        files:false
      },
    },
    mounted() {  
      this.BetcheckLogin()
      this.getData()
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
      //关闭所有弹窗
      closeAll(){
        this.windows = {
          bank:false,
          topUp:false,
          withdrawa:false,
          temp:false,
          changePassword:false,
          cosutomer:false,
          inverRecord:false,
          record:false,
          main:true
  
        }
      },
      //初始化充值部分
      async topUp(){
        this.node.loadding = true
        const type = this.topUpData.topUpType
        try{
          const token = this.token
          const res = await axios.post('https://2dmaster.com/api/getAccount',{
            type:type  
          },{
            headers: {
              Authorization: `Bearer ${token}`  // 通常是这样写
            },
            timeout:5000
          })
          if(res.data.code === 502 || res.data.code === 404){
            this.nodeWin(false,'Network error, please try again','参数不全','Network error, please try again')
            return
          }
          this.node.loadding = false
          this.windows.topUp = true
          this.topUpData.name = res.data.data[0].name
          this.topUpData.num = res.data.data[0].number
        }catch{
          this.nodeWin(false,'Network error, please try again','网络异常','Network error, please try again')
          return
        }
      },



     async configTopUp(){
        // this.node.loadding = true
        const originData = this.topUpData
        const name = originData.name || null
        const num = originData.num || null
        const inName = originData.inName
        const inNumber = originData.inNumber
        const fiveDid = originData.fiveDid || null
        const amount = originData.amount
        const type = originData.topUpType
        const status = originData.status
        if(!fiveDid && originData.status === 1){
          console.log(11);
          
          this.nodeWin(false,'单号流水不可为空','单号流水不可为空','单号流水不可为空')
          return
        }
        try{
          const username = this.username
          const token = this.token
          const res = await axios.post('https://2dmaster.com/api/configTopUp',{
            username:username,
            name:name,
            num:num,
            inName:inName,
            inNumber:inNumber,
            fiveDid:fiveDid,
            amount:amount,
            type:type,
            is_out:status
          },{
            headers: {
              Authorization: `Bearer ${token}`  // 通常是这样写
            },
            timeout:5000
          })
          if(res.data.code === 502 || res.data.code === 403){
            this.nodeWin(false,'Network error, please try again','参数不全','Network error, please try again')
            return
          }
          if(res.data.code === 400){
            this.nodeWin(false,'Network error, please try again','余额不足','Network error, please try again')
            return
          }
          if(res.data.code === 200){
            this.nodeWin(true,'成功','成功','成功')
            this.closeAll()
            return
          }
        }catch{
          this.nodeWin(false,'Network error, please try again','网络异常','Network error, please try again')
          return
        }
      },

      async getTemp(){
        this.node.loadding = true
        try{
          const username = this.username
          const token = this.token
          const res = await axios.post('https://2dmaster.com/api/getTempData',{
            username:username,
                    },{
            headers: {
              Authorization: `Bearer ${token}`  // 通常是这样写
            },
            timeout:5000
          })
          const data = res.data
          if(data.code != 200){
            this.nodeWin(false,'Network error, please try again','网络异常','Network error, please try again')
            return
          }
          this.tempData.totalPoint = data.totalPoint
          this.tempData.totalIn = data.totalIn
          this.tempData.totalOut = data.totalOut
          this.tempData.data = data.data
          this.node.loadding = false
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
        this.username = token.username
        this.token = token.token
      },
      
      async getData(){
        try{
          const username = this.username
          const token = this.token
          const res = await axios.post('https://2dmaster.com/api/getUserInfo',{
            username:username  
          },{
            headers: {
              Authorization: `Bearer ${token}`  // 通常是这样写
            },
            timeout:5000
          })
          if(res.data.code === 502){
            this.nodeWin(false,'Network error, please try again','参数不全','Network error, please try again')
            return
          }
          const data = res.data.data[0]
          this.userInfo.userid = data.id
          this.userInfo.username = data.username
          this.userInfo.userBalance = data.balance
          this.userInfo.userinvBalance = data.inviter_balance
        }catch{
          this.nodeWin(false,'Network error, please try again','网络异常','Network error, please try again')
          return
        }
      },
      nodeWin(success,ent,zht,mmt){     
        if(success){
          this.language.zh.node.success.textp = zht
          // this.language.en.node.success.textp = ent
          // this.language.my.node.success.textp = mmt
          this.closeStatus()
          this.node.success = true
        }else{
          this.language.zh.node.files.textp = zht
          // this.language.en.node.files.textp = ent
          // this.language.my.node.files.textp = mmt
          this.closeStatus()
          this.node.files = true
        }
        console.log(this.node.loadding);
      },
      closeStatus(){
        this.node = {
          nodeShow:false,
          loadding:false,
          nodeBet:false,
          success:false,
          files:false
        }
      }
    }
})