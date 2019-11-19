/*
**  对话框组件：
**  1、
**
**  author bilibili id：--刃舞--
**
**  参数：
**  
*/

// 注册对话框全局组件
Vue.component('rw-dialog', {
  template: `
    <div class="rwDialog" :style="show">
    12321
      <slot name="demo" :test3="test" :test4="test2"></slot>
      341
    </div>
  `,
  props: ['params'], // 获取父组件传入的参数

  data: function() {
    return {
      msg:'1234',
      test: '我是从子组件传给父组件的字符串',
      test2: '我是子组件传给父组件的第二个字符串'
    }
  },

  methods: {
    showDialog() {
      
    }
  },

  // 计算属性
  computed:{

    // 同步父组件的 show 到自身
    show() {
      return this.params.show
      ? { display: 'block' }
      : { display: 'none' }
    }
  },

  watch: {

    // 监听自身的 show
    show() {
      console.log(123);
    }
  }
});
