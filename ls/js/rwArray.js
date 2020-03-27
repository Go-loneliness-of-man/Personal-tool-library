/*
  rwArray：数组相关

  目前已有的方法：

  1、notRepeat(arr, target, compare = undefined, index = 0)，数组查重，参数：
    arr：          array               被查询的数组
    target：       any                 目标元素
    compare：      function            比较器，默认直接比较 arr[i]、target 是否相等，传了后会将 arr[i]、target 依次传入比较器进行比较，返回 1 代表不重复，0 代表重复
    index：        int                 是否返回重复项的下标，默认 0，若传 1，返回值变为对象 { repeat: int, i: int }，repeat 即原返回值，i 是下标

  2、convertTree(data = [{ id: '1' }])，数组转 tree，每个对象以 id 为标识，例如 1、12、13、14，则 12、13、14 是 1 的子节点
*/

(function(window) {

  // 声明类
  class rwArray {

    //构造函数
    constructor() {

    }

    // 数组查重，参数依次是数组、目标元素、比较器（回调函数）、是否重复项的返回下标（此时返回对象 { repeat: int, i: int }），重复返回 0，不重返回 1
    notRepeat(arr, target, compare = undefined, index = 0) {
      let i = 0;
      if (compare)                                          // 判断是否存在比较器
        for (i = 0; i < arr.length; i++)                    // 遍历比较
          if (compare(arr[i], target))                      // 调用比较器
            return index ? { repeat: 0, i } : 0;            // 判断是否返回下标
      else
        for (i = 0; i < arr.length; i++)
          if (arr[i] === target)
            return index ? { repeat: 0, i } : 0;            // 判断是否返回下标
      return index ? { repeat: 1, i } : 1;                  // 判断是否返回下标
    }

    // 思路：先遍历获取 id 的长度列表，然后获取一级节点，再循环获取每个一级节点的子节点，而对于每个节点，若其仍有子节点则继续向下递归，直到不存在子节点便返回
    // 参数是待转换数组
    convertTree(data = [{ id: '1' }]) { // 数组转换 tree
      function parse(data, father, lenList = [], lenIndex = 0) { // 递归生成子节点
        let match = data.filter(v => v.id.length === lenList[lenIndex + 1] && father.id === v.id.slice(0, lenList[lenIndex])); // 匹配长度、前缀
        if(match.length) // 当存在子节点时，继续搜索生成子节点
          father.children = match.map(v => parse(data, v, lenList, lenIndex + 1));
        return father;
      }

      let lenList = [...new Set(data.map(v => v.id.length))]; // 获取 id 长度列表
      let father = data.filter(v => v.id.length === lenList[0]).map(v => ({ id: v.id, children: [] })); // 获取一级节点
      father.forEach(v => parse(data, v, lenList)); // 遍历一级节点
      return father;
    }
  }

  window.rwArray = new rwArray();                           // 将类挂在 window 上
})(window);

