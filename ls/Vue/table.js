/*
**  待实现：
**  1、将插槽应用到组件中
**
**
**
**  表格组件：
**  1、支持单元格合并、多事件绑定、事件传参;
**  2、组件自带基本样式，但也可自定义表格各部分样式，组件、表格标题、表格主体、一行、一个单元格依次对应 css 类 rwTable、rwTableTitle、rwTableBody、rwTableRow、rwTableUnit;
**  3、注：表格各部分默认采用 flex 布局;
**
**  author bilibili id：--刃舞--
**
**  参数：
**  title:        string                                                  表格标题
**  table:        [[object, object ...], [object, object ...] ...]        二维数组，表格主体，一维代表一行，一个对象代表一个单元格，单元格具有 text、width、click、params、styleParams、id 等几个属性，下面具体解释
**  unitWidth:    int                                                     单位宽度
**  height:       int                                                     一行的高度
**
**  table:  这里具体解释下 table 内单元格的几个属性
**  text:         any                                                     单元格内存放的内容，一般为 string
**  width:        int                                                     多少个单位宽度，单位宽度是 unitWidth，例如单元格 width 是 3，unitWidth是 100，则该单元格宽度为 300px
**  click:        [ string, string ...]                                   所有点击事件名，事件需从父组件传给表格组件，所有事件会被传入两个参数，第二个参数是单元格 id
**  params:       [ any, any ...]                                         所有点击事件的第一个参数，每个元素会依次被传给 click 事件作为第一个参数
**  styleParams:  object                                                  单元格样式，用于定制某个单元格的样式
**  id:           any                                                     会被绑定到单元格的 data-id 属性上，用于唯一标识单元格，建议用 int
**
**  示例：

template:
<div class="el">
  <rw-table :params="one" @unit_click="demo" @unit_click2="demo2"></rw-table>
</div>

js:
const vm = new Vue({
  el: ".el",

  data: {
    one: {
      title: 'demo',
      table: [
        [{ text: '合单元格', width: 4 }, { text: '1', width: 1 }, { text: '合单元格', width: 4 }],
        [{ text: '2', width: 1, unit_id: 8 }, { text: '2', width: 1 }, { text: '2', width: 1 }, { text: '2', width: 1 }, { text: '事件绑定', width: 5,
                                                                                                                            click: ['unit_click', 'unit_click2'], // 单元格事件绑定
                                                                                                                            params: [123, 456],                   // 单元格事件传参
                                                                                                                            styleParams: { cursor: 'pointer' },   // 单元格样式
                                                                                                                            id: '我是单元格 id'                    // 单元格 id
                                                                                                                          }],
        [{ text: '合单元格', width: 6 }, { text: '3', width: 1, unit_id: 8 }, { text: '3', width: 1 }, { text: '3', width: 1 }],
        [{ text: '4', width: 1 }, { text: '4', width: 1, unit_id: 8 }, { text: '4', width: 1 }, { text: '4', width: 1 },
          { text: '4', width: 1 }, { text: '4', width: 1 }, { text: '4', width: 1 }, { text: '4', width: 1 }, { text: '4', width: 1 }]
      ],
      unitWidth: 40,
      height: 40
    }
  },

  methods: {

    // 用于事件绑定，测试用
    demo(num, id) {
      console.log(num);
      console.log(id);
    },

    // 用于事件绑定，测试用
    demo2(num, id) {
      console.log(num);
      console.log(id);
    }
  }
});
*/

// 注册为全局组件
Vue.component('rw-table', {
  template:`
    <div class="rwTable" :style="{ width: styleParams.width + 'px' }"><!-- 根元素  -->
      <h2 class="rwTableTitle" style="text-align:center">{{title}}</h2><!--  表格标题  -->
      <div class="rwTableBody" style="display:flex; flex-wrap:wrap"><!--  表格主体  -->
        <div class="rwTableRow" v-for="(row, rowIndex) in table" :style="styleParams | rowStyle"><!-- 一行 -->
          <div  class = "rwTableUnit"
                v-for = "(unit, unitIndex) in row"
                :style = "unit.width, styleParams, rowIndex, unitIndex, unit.styleParams | unitStyle"
                @click = "unit_click(unit.click, unit.params, unit.id)"
          >{{unit.text}}</div><!-- 一个单元格 -->
        </div>
      </div>
    </div>`,

  props: ['params'], // 获取父组件传入的参数

  data: function() {
    let width = 0, max;
    this.params.table.forEach(row => {                                                // 计算表格整体宽度，遍历行，找出最大行宽
      max = 0;                                                                        // 每行的宽度
      row.forEach(unit => max += unit.width * this.params.unitWidth )                 // 计算每行的宽度，遍历单元格累加
      width =  max > width ? max : width;                                             // 判断是否是最大行宽
    });
    return {
      title: this.params.title ? this.params.title : '',                              // 表格标题
      table: this.params.table ? this.params.table : [],                              // 表格主体
      styleParams: {                                                                  // 样式参数
        width: this.params.width ? this.params.width : width,                         // 组件整体宽度
        height: this.params.height ? this.params.height : 30,                         // 一行的高度
        unitWidth: this.params.unitWidth ? this.params.unitWidth : 30,                // 单位宽度
        fontSize: this.params.fontSize ? this.params.fontSize : 15,                   // 字体大小
        color: this.params.color ? this.params.color : 'grey',                        // 字体颜色
      }
    }
  },

  methods: {

    // 单元格点击事件
    unit_click(click, params, id) {
      if(click) {                                                                     // 判断该单元格是否存在点击事件
        for(let i = 0; i < click.length; i++) {                                       // 存在，遍历执行
          this.$emit(click[i], params[i], id);
        }
      }
    }
  },

  // 过滤器
  filters: {

    // 行样式
    rowStyle(params) {
      const { height } = params, style = {};
      style.display = 'flex';
      style.height = height + 'px';
      return style;
    },

    // 单元格样式
    unitStyle(w, params, rowIndex, unitIndex, styleParams) {
      const { unitWidth, height, color, fontSize } = params, style = {};
      style.boxSizing = 'border-box';                                                 // 为了方便计算，单元格采用边框盒子模型
      style.width =  w * unitWidth + 'px';                                            // 计算单元格宽度，消除边框带来的宽度误差
      style.height = height + 'px';
      style.lineHeight = style.height;                                                // 垂直居中
      style.textAlign = 'center';                                                     // 水平居中
      style.whiteSpace = 'nowrap';                                                    // 溢出省略号
      style.textOverflow = 'ellipsis';
      style.overflow = 'hidden';
      rowIndex ? style.borderTop = 'none' : 0;                                        // 第二行起没有顶边框
      unitIndex ? style.borderLeft = 'none' : 0;                                      // 从第二列起没有左边框
      for(let k in styleParams) {                                                     // 若定义了单元格样式，进行样式覆盖
        style[k] = styleParams[k];
      }
      return style;
    }
  }
});