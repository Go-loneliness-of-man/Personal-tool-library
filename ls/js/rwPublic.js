/*
  rwPublic：常用公共方法

  目前已有的方法：

  1、type(data)，返回变量的类型，精确到类名

  2、deepCopy(x)，递归深拷贝

  3、rand(low, high, don = 0)，生成指定区间随机数，参数依次是下限、上限、小数位长度
*/

(function(window){

  // 声明类
  class rwPublic {

    //构造函数
    constructor() {

    }

    // 判断变量类型
    type(data) {
      const type = Object.prototype.toString.call(data).toLowerCase();
      return type.replace(/^\[object\s(\w+)\]$/, (...rest) => {
        return rest[1];
      });
    }

    // 递归深拷贝
    deepCopy(x) {
      if (this.type(x) !== 'object') return '必须传入对象';      // 若不是对象则结束
      const target = Array.isArray(x) ? [] : {};                // 判别是数组还是对象
      for (const k in x)                                        // 循环拷贝
        if (x.hasOwnProperty(k))                                // 判断属性是否在对象自身上
          if (this.type(x[k]) === 'object')                     // 若是对象，递归
            target[k] = this.deepCopy(x[k]);
          else
            target[k] = x[k];
      return target;
    }

    // 生成指定区间随机整数
    rand(low, high, don = 0) {
      let num;
      for (num = 1; don; num *= 10, don--);
      return num > 1 ? parseInt((low + Math.random() * (high - low)) * num) / num : parseInt(low + Math.random() * (high - low));
    }
  }

  window.rwPublic = new rwPublic();                                  // 将类挂在 window 上
})(window);




