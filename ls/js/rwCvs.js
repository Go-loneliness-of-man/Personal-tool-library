/*
  rwCvs：封装 canvas

  目前已有方法：
  

*/

(function(window) {

  // 声明 canvas 类
  class rwCvs {

    ctx;

    //构造函数
    constructor(ctx) {
      this.ctx = ctx;
    }

    // point edge angle，计算一点与一边两端点的夹角
    pEAngle(obj = { x: 0, y: 0 }, point = [{ x: 0, y: 0 }, { x: 0, y: 0 }]) {
      let a = { x: point[0].x - obj.x, y: point[0].y - obj.y };                         // 向量 a
      let b = { x: point[1].x - obj.x, y: point[1].y - obj.y };                         // 向量 b
      let aEdge = Math.sqrt(Math.pow(a.x, 2) + Math.pow(a.y, 2));                       // |a|
      let bEdge = Math.sqrt(Math.pow(b.x, 2) + Math.pow(b.y, 2));                       // |b|
      let deg = Math.acos((a.x * b.x + a.y * b.y) / (aEdge * bEdge)) * 180 / Math.PI;   // deg = arccos(a * b / |a| * |b|)
      return parseInt(deg * 100) / 100;                                                 // 保留两位小数
    }
    
    // 判断一点是否在一封闭多边形内部
    isInside(obj = { x: 0, y: 0 }, point = [{ x: 0, y: 0 }]) {
      let all = 0;                                                                      // 总度数
      for(let i = 0; i < point.length; i++)                                             // 循环计算所有边
        all += pEAngle(obj, [point[i], (i === point.length - 1) ? point[0] : point[i + 1]]);
      return all > 359.9 && all < 360.1;                                                // 误差小于 0.1
    }

    // 设置样式
    style(style) {
      let { ctx } = this;
      for(let key in style)
        ctx[key] = style[key];
      return ctx;
    }

    // 连续绘制线条
    mtp(point, style = {}) {
      let { ctx } = this;
      ctx.beginPath();                          // 开启新状态
      ctx = ctxStyle(ctx, style);
      ctx.moveTo(point[0], point[1]);           // 重置起点
      for(let i = 2; i < point.length; i += 2)  // 循环绘制
        ctx.lineTo(point[i], point[i + 1]);
      ctx.stroke();                             // 上色
      ctx.beginPath();                          // 开启新状态
    }

    // 转换角度到弧度，注，数学里逆时针弧度为正，但浏览器内 y 轴向下，所以顺时针弧度为正
    rad(deg) {
      return deg * Math.PI / 180;
    }

    // 绘制文本
    drawText(text, point = { x: 0, y: 0}, fill = 0, style = {}) {
      let { ctx } = this;
      ctx.beginPath();                          // 开启新状态
      ctx = ctxStyle(ctx, style);
      if(fill)  ctx.fillText(text, point.x, point.y);
      else      ctx.strokeText(text, point.x, point.y);
      ctx.beginPath();                          // 开启新状态
    }
  }

  window.rwCvs = new rwCvs();                                               // 将实例挂在 window 上
})(window);




