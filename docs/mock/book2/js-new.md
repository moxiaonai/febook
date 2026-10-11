# New 操作符的原理


## 相关问题

- new 操作符做了什么
- new 操作符的模拟实现


## 回答关键点


`构造函数` `对象实例`


new 操作符通过执行自定义构造函数或内置对象构造函数，生成对应的对象实例。


## 知识点深入


### 1. new 操作符做了什么

1. 在内存中创建一个新对象。
2. 将新对象内部的 __proto__ 赋值为构造函数的 prototype 属性。
3. 将构造函数内部的 this 被赋值为新对象（即 this 指向新对象）。
4. 执行构造函数内部的代码（给新对象添加属性）。
5. 如果构造函数返回非空对象，则返回该对象。否则返回 this。


### 2. new 操作符的模拟实现


```js
function fakeNew() {
  // 创建新对象
  var obj = Object.create(null);
  var Constructor = [].shift.call(arguments);
  // 将对象的 __proto__ 赋值为构造函数的 prototype 属性
  obj.__proto__ = Constructor.prototype;
  // 将构造函数内部的 this 赋值为新对象
  var ret = Constructor.apply(obj, arguments);
  // 返回新对象
  return typeof ret === "object" && ret !== null ? ret : obj;
}

function Group(name, member) {
  this.name = name;
  this.member = member;
}

var group = fakeNew(Group, "hzfe", 17);
```


## 参考资料

1. [new 操作符 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new)
2. [The new Operator](https://262.ecma-international.org/5.1/#sec-11.2.2)
