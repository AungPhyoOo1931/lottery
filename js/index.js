const app = new Vue({
    el: '#app',
    data: {
      betList: []
    },
    mounted() {  // 这里应该是函数，不是对象
      this.showBetList();  // 需要加括号调用方法
    },
    methods: {
      showBetList() {
        this.betList = Array.from({ length: 100 }, (_, index) => ({
          id: index + 1,
          value: index ,  // 修正索引显示（从1开始）
          checked: false,
        }));
      }
    }
  })