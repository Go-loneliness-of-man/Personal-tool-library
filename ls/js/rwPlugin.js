/*
  rwPlugin：插件

  目前已有插件：

  1、旋转节点，参数分别是旋转节点、背景元素节点，直接传入构造函数即可，效果是点击拖拽旋转

*/

(function(window) {

  // 旋转节点，参数分别是旋转节点、背景元素
  class RotateNode {

    el;                                                                           // 元素节点
    current;                                                                      // 鼠标当前位置
    start;                                                                        // 每次拖拽旋转的开始点
    center;                                                                       // 元素中心坐标
    flag;                                                                         // 是否已按下鼠标
    currentDeg;                                                                   // 当前旋转角度

    constructor(el, bg) {
      this.el = el;                                                               // 保存节点
      this.center = { x: el.offsetLeft + el.scrollWidth / 2, y: el.offsetTop + el.scrollHeight / 2 }; // 元素中心坐标
      this.current = new Proxy({ x: 0, y: 0 }, { get: this.get.bind(this) });     // 鼠标当前位置
      this.start = new Proxy({ x: 0, y: 0 }, { get: this.get.bind(this) });       // 每次拖拽旋转的开始点
      this.flag = false;                                                          // 是否已按下鼠标
      this.currentDeg = 0;                                                        // 当前旋转角度
      bg.onmousedown = this.mousedown.bind(this);                                 // 按下鼠标，更新旋转的起始点坐标，开始旋转
      bg.ontouchstart = this.mousedown.bind(this);                                // 移动端触摸事件
      bg.onmousemove = this.mousemove.bind(this);                                 // 移动鼠标，更新当前点，计算当前角度
      bg.ontouchmove = this.mousemove.bind(this);                                 // 移动端滑动事件
      bg.onmouseup = this.mouseup.bind(this);                                     // 松开鼠标，停止旋转，更新当前角度
      bg.ontouchend = this.mouseup.bind(this);                                    // 移动端离开事件
    }

    // 按下鼠标，更新旋转的起始点坐标，开始旋转
    mousedown (eve) {
      this.start.x = eve.clientX ? eve.clientX : eve.touches[0].clientX;          // 更新旋转的起始点坐标
      this.start.y = eve.clientY ? eve.clientY : eve.touches[0].clientY;
      this.flag = true;                                                           // 开始旋转
    }

    // 移动鼠标，更新当前点，计算当前角度
    mousemove(eve) {
      this.current.x = eve.clientX ? eve.clientX : eve.touches[0].clientX;        // 更新鼠标实时坐标
      this.current.y = eve.clientY ? eve.clientY : eve.touches[0].clientY;
      if(this.flag)                                                               // 判断是否旋转
          this.el.style.transform = `rotate(${this.compute()}deg)`;               // 利用 2D 变换进行旋转
    }

    // 松开鼠标，停止旋转，更新当前角度
    mouseup (eve) {
      this.flag = false;                                                          // 停止旋转
      this.currentDeg = this.compute();                                           // 更新当前角度
    }

    // 修正旋转角度，当两点相对 y 轴异侧时取互补角
    pd(deg) {
      const cu = this.current;
      const s = this.start;
      return (cu.x > 0 && s.x > 0) || (cu.x < 0 && s.x < 0) ? deg : 180 + deg;
    }

    // 计算应该旋转到的角度
    compute() {
      const k1 = this.start.y / this.start.x;                                     // 计算两点与节点中心连线和 x 轴所成角的正切值
      const k2 = this.current.y / this.current.x;
      const deg = this.deg(k1) - this.pd(this.deg(k2));                           // 利用反正切函数算出角度
      return Math.floor(this.currentDeg + deg);                                   // 返回角度
    }
    
    // 坐标转换
    get(target, key, receiver) {
      return key === 'x' ? target[key] - this.center[key] : this.center[key] - target[key];
    }

    // 根据斜率计算角度
    deg(k) {
      return Math.atan(k) * 180 / Math.PI;
    }

    test() {
      return `<!DOCTYPE html><html lang="en"><head><title>旋转节点</title><style>*{width: 0px;height: 0px;margin:0px;padding: 0px;}html{width: 100%;height: 100%;}body{width: 100%;height: 100%;}.demo{width: 100px;height: 100px;position: absolute;top: 50%;left: 50%;margin-top: -50px;margin-left: -50px;background: red;border-right: black solid 20px;}</style></head><body><div class="demo"></div></body><script type="text/javascript" src="ls/js/plugin.js"></script><script>let demo = new window.rwPlugin.RotateNode(document.getElementsByClassName('demo')[0], document.body);</script></html>`;
    }
  }

  // 声明插件类
  class rwPlugin {

    //构造函数
    constructor() {
      this.RotateNode = RotateNode;                                               // 旋转节点
    }
  }

  window.rwPlugin = new rwPlugin();                                               // 将插件实例挂在 window 上
})(window);




