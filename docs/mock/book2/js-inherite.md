# ES5、ES6 如何实现继承


## 相关问题

- 关于 ES5 和 ES6 的继承问题
- 原型链概念


## 回答关键点


`原型链继承` `构造函数继承` ` ES6 类继承`


继承是指子类型具备父类型的属性和行为，使代码得以复用，做到设计上的分离。JavaScript 中的继承主要通过原型链和构造函数来实现。常见的继承方法有：ES6 中 class 的继承、原型链继承、寄生组合式继承等。


## 知识点深入


### 1. 原型链


原型链的本质是拓展原型搜索机制。每个实例对象都有一个私有属性 __proto__。该属性指向它的构造函数的原型对象 prototype。该原型对象的 __proto__ 也可以指向其他构造函数的 prototype。依次层层向上，直到一个对象的 __proto__ 指向 null。根据定义，null 没有原型，并作为这个原型链中的最后一个环节。


当试图访问一个对象的属性时，它不仅仅在该对象上搜寻，还会搜寻该对象的原型，以及该对象的原型的原型，依次层层向上搜索，直到找到一个名字匹配的属性或直到这个链表结束（`Object.prototype.__proto__ === null`）。


### 2. 原型链继承


原型链继承的思想：**一个引用类型继承另一个引用类型的属性和方法**。


```js
function SuperType() {
  this.b = [1, 2, 3];
}

function SubType() {}

SubType.prototype = new SuperType();
SubType.prototype.constructor = SubType;

var sub1 = new SubType();
var sub2 = new SubType();

// 这里对引用类型的数据进行操作
sub1.b.push(4);

console.log(sub1.b); // [1,2,3,4]
console.log(sub2.b); // [1,2,3,4]
console.log(sub1 instanceof SuperType); // true
```


**优点：**

1. 父类新增原型方法/原型属性，子类都能访问到。
2. 简单、易于实现。


**缺点：**

1. 无法实现多继承。
2. 由于原型中的引用值被共享，导致实例上的修改会直接影响到原型。
3. 创建子类实例时，无法向父类构造函数传参。


### 3. 构造函数继承


构造函数继承的思想：**子类型构造函数中调用父类的构造函数，使所有需要继承的属性都定义在实例对象上**。


```js
function SuperType(name) {
  this.name = name;
  this.b = [1, 2, 3];
}

SuperType.prototype.say = function () {
  console.log("HZFE");
};

function SubType(name) {
  SuperType.call(this, name);
}

var sub1 = new SubType();
var sub2 = new SubType();

// 传递参数
var sub3 = new SubType("Hzfe");

sub1.say(); // 使用构造函数继承并没有访问到原型链，say 方法不能调用

console.log(sub3.name); // Hzfe

sub1.b.push(4);

// 解决了原型链继承中子类实例共享父类引用属性的问题
console.log(sub1.b); // [1,2,3,4]
console.log(sub2.b); // [1,2,3]
console.log(sub1 instanceof SuperType); // false
```


**优点：**

1. 解决了原型链继承中子类实例共享父类引用属性的问题。
2. 可以在子类型构造函数中向父类构造函数传递参数。
3. 可以实现多继承（call 多个父类对象）。


**缺点：**

1. 实例并不是父类的实例，只是子类的实例。
2. 只能继承父类的实例属性和方法，不能继承原型属性和方法。
3. 无法实现函数复用，每个子类都有父类实例函数的副本，影响性能。


### 4. 组合继承（伪经典继承）


组合继承的思想：**使用原型链实现对原型属性和方法的继承，借用构造函数实现对实例属性的继承**。


```js
function SuperType(name) {
  this.name = name;
  this.a = "HZFE";
  this.b = [1, 2, 3, 4];
}

SuperType.prototype.say = function () {
  console.log("HZFE");
};

function SubType(name) {
  SuperType.call(this, name); // 第二次调用 SuperType
}

SubType.prototype = new SuperType(); // 第一次调用 SuperType
SubType.prototype.constructor = SubType;
```


**优点：**

1. 可以继承实例属性/方法，也可以继承原型属性/方法。
2. 不存在引用属性共享问题。
3. 可传参
4. 函数可复用


**缺点：**

1. 调用了两次父类构造函数（耗内存），生成了两份实例。


### 5. 寄生组合式继承


寄生组合式继承的思想：**借用构造函数来继承属性，使用混合式原型链继承方法**。


```js
// 在函数内部，第一步创建父类原型的一个副本，第二部是为创建的副本添加 constructor 属性，
// 从而弥补因重写而失去的默认的 constructor 属性。最后一步，将新创建的对象（即副本）赋值给予类型的原型。
function inheritPrototype(subType, superType) {
  var prototype = Object.create(superType.prototype); // 创建对象
  prototype.constructor = subType; // 增强对象
  subType.prototype = prototype; // 指定对象
}

function SuperType(name) {
  this.name = name;
}

SuperType.prototype.sayName = function () {
  console.log(this.name);
};

function SubType(name, num) {
  SuperType.call(this, name);
  this.num = num;
}

inheritPrototype(SubType, SuperType);

SubType.prototype.sayNum = function () {
  console.log(this.num);
};
```


**优点：**

1. 只调用了一次 SuperType 构造函数，避免了在 SubType.prototype 上创建不必要的属性。
2. 能够正常使用 instanceof 和 isPrototypeOf()。


**缺点：**

1. 实现较为复杂


### 6. ES6 中 class 的继承


ES6 中引入了 class 关键字， class 可以通过 extends 关键字实现继承，还可以通过 static 关键字定义类的静态方法，这比 ES5 的通过修改原型链实现继承，要清晰和方便很多。
**需要注意的是：class 关键字只是原型的语法糖， JavaScript 继承仍然是基于原型实现的。**


```js
class Pet {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  showName() {
    console.log("调用父类的方法");
    console.log(this.name, this.age);
  }
}

// 定义一个子类
class Dog extends Pet {
  constructor(name, age, color) {
    super(name, age); // 通过 super 调用父类的构造方法
    this.color = color;
  }

  showName() {
    console.log("调用子类的方法");
    console.log(this.name, this.age, this.color);
  }
}
```


**优点：**

1. 清晰方便


**缺点：**

1. 不是所有的浏览器都支持 class。


## 参考资料

1. [JS 实现继承的几种方式](https://www.cnblogs.com/humin/p/4556820.html)
2. [阮一峰 ES6 入门之 class 的继承](https://es6.ruanyifeng.com/#docs/class-extends)
3. 《JavaScript 高级程序设计》
4. 《你不知道的 JavaScript》
