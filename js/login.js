const app = new Vue({
    el: '#app',
    data: {
      lang:'en',
      language:{
        en:{
          title:'Lottery Manager',
          nodeText:'' 
        },
        zh:{
          title:'彩票大师',
          nodeText:''    
        },
        my:{
          title:'Lottery Manager',
          nodeText:'' 
        }
      },
      timeset:{
        day:0,
        hour:0,
        min:0,
        sec:0,
      },
      loginData:{
        username:'',
        password:''
      },
      registerData:{
        username:'',
        password:'',
        configPasswrod:'',
        inver:''
      },
      node:{
        nodeShow:false,
      },
      isLogin:false
    },
    mounted(){
      const userData = JSON.parse(localStorage.getItem('loginData')) || null
      if(userData){
        window.location.href = './index.html'
        return
      }
    },
    computed:{
      text() {
        return this.language[this.lang] || {};
      }
    },
    methods: {
      Node(){
        this.node.nodeShow = true
        setTimeout(() => {
          this.node.nodeShow = false
        }, 3000);
      },
      async login(){
        const username = this.loginData.username || null
        const password = this.loginData.password || null
        const userData = JSON.parse(localStorage.getItem('loginData')) || null
        if(userData){
          window.location.href = './index.html'
          return
        }
        if(!username || !password){
          this.text.nodeText = "用户名或密码为空"
          this.Node()
          return
        }
        const res = await axios.post('https://2dmaster.com/api/login',{
          username:username,
          password:password
        })
        const data = res.data
        if(data.msg === "用户不存在"){
          this.text.nodeText = "用户不存在"
          this.Node()
          return
        }
        if(data.msg === "密码错误"){
          this.text.nodeText = "密码错误"
          this.Node()
          return
        }
        if (data.msg === "登录成功" && data.token && data.user) {
          this.text.nodeText = "登录成功";
          this.Node();
        
          const { token, user } = data;
          const { id, username } = user;
        
          const userData = JSON.stringify({ token, id, username });
          localStorage.setItem('loginData', userData);
          window.location.href = './index.html'
          return
        }
        this.text.nodeText = "出现未知错误";
          this.Node();
      },
      async register(){
        const username = this.registerData.username || null
        const password = this.registerData.password || null
        const configPasswrod = this.registerData.configPasswrod || null
        const inviter = this.registerData.inver || null
        if(!username || !password || !configPasswrod){
          this.text.nodeText = "请填写完整内容"
          this.Node()
          return
        }
        if(password !== configPasswrod){
          this.text.nodeText = "两次密码不一致"
          this.Node()
          return
        }
        const res = await axios.post('https://2dmaster.com/api/register',{
          username,
          password,
          configPasswrod,
          inviter
        })
        const data = res.data
        console.log(data);
        if(data.msg === "用户名已存在"){
          this.text.nodeText = "用户名已存在"
          this.Node()
          return
        }
        if(data.msg === "注册成功"){
          this.text.nodeText = "注册成功请登录"
          this.Node()
          this.isLogin = false
          return
        }
      }
    }  
  })