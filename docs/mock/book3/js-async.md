# JavaScript 异步编程


## 相关问题

- JavaScript 异步编程方案有哪些
- JavaScript 异步编程方案各有什么优缺点


## 回答关键点


`阻塞` `事件循环` `回调函数`


JavaScript 是一种同步的、阻塞的、单线程的语言，一次只能执行一个任务。但浏览器定义了非同步的 Web APIs，将回调函数插入到[事件循环](/awesome-interview/book3/browser-event-loop)，实现异步任务的非阻塞执行。常见的异步方案有异步回调、定时器、发布/订阅模式、Promise、生成器 Generator、async/await 以及 Web Worker。


## 知识点深入


### 1. 异步回调


异步回调函数作为参数传递给在后台执行的其他函数。当后台运行的代码结束，就调用回调函数，通知工作已经完成。具体示例如下：


```js
// 第一个参数是监听的事件类型，第二个就是事件发生时调用的回调函数。
btn.addEventListener("click", () => {
  console.log("You clicked me!");

  const pElem = document.createElement("p");
  pElem.textContent = "hello, hzfe.";
  document.body.appendChild(pElem);
});
```


异步回调是编写和处理 JavaScript 异步逻辑的最常用方式，也是最基础的异步模式。但是随着 JavaScript 的发展，异步回调的问题也不容忽视：

1. 回调表达异步流程的方式是非线性的，非顺序的，理解成本较高。
2. 回调会受到控制反转的影响。因为回调的控制权在第三方（如 Ajax），由第三方来调用回调函数，无法确定调用是否符合预期。
3. 多层嵌套回调会产生回调地狱（callback hell）。


### 2. 定时器：setTimeout/setInterval/requestAnimationFrame


这三个都可以用异步方式运行代码。主要特征如下：

1. setTimeout：经过任意时间后运行函数，**递归 setTimeout 在 JavaScript 线程不阻塞的情况下可保证执行间隔相同**。
2. setInterval：允许重复执行一个函数，并设置时间间隔，**不能保证执行间隔相同**。
3. requestAnimationFrame：以**当前浏览器/系统的最佳帧速率**重复且高效地运行函数的方法。一般用于处理动画效果。


setInterval 会按设定的时间间隔固定调用，其中 setInterval 里面的代码的执行时间也包含在内，所以**实际间隔小于设定的时间间隔**。而递归 setTimeout 是调用时才开始算时间，可以保证多次递归调用时的间隔相同。


如果当前 JavaScript 线程**阻塞**，轮到的 setInterval 无法执行，那么本次任务就会**被丢弃**。而 setTimeout 被阻塞后不会**被丢弃**，等到空闲时会继续执行，但无法保证执行间隔。


### 3. 发布/订阅模式（publish-subscribe pattern）


**发布/订阅模式是一种对象间一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到状态改变的通知。**


上面异步回调的例子也是一个发布/订阅模式（publish-subscribe pattern）的实现。订阅 btn 的 click 事件，当 btn 被点击时向订阅者发送这个消息，执行对应的操作。


```js
class PubSub {
  constructor() {
    // 存储所有订阅的事件类型及对应的订阅函数数组
    // key <eventType>: value <subscribeList>[]
    this.handlers = {};
  }
  // 订阅事件方法
  on(eventType, handler) {
    if (!(eventType in this.handlers)) this.handlers[eventType] = [];
    this.handlers[eventType].push(handler);
  }
  // 消息发布方法
  emit(eventType, ...handlerArgs) {
    this.handlers[eventType].forEach((v) => {
      v(...handlerArgs);
    });
  }
  // 取消订阅
  remove(eventType, handler) {
    // 没有传入具体的事件处理函数，则移除该事件类型的所有订阅函数
    // 有则在订阅数组中移除对应的函数
    if (!handler) {
      this.handlers[eventType].length = 0;
    } else {
      const key = this.handlers[eventType].findIndex((v) => v === handler);
      if (key !== -1) this.handlers[eventType].splice(key, 1);
    }
  }
}

const test1 = new PubSub();
const fn1 = (...data) => console.log(data);
test1.on("event1", fn1);
test1.on("event1", (...data) => console.log(`fn2: ${data}`));
test1.emit("event1", "hzfe1", "hzfe2", "hzfe3");
test1.remove("event1", fn1);
// ["hzfe1", "hzfe2", "hzfe3"] fn1打印
// fn2: hzfe1,hzfe2,hzfe3
```


发布/订阅模式可以更细致地了解到有多少种事件类型以及每种类型对应的订阅事件，方便进一步的监听与控制。


### 4. Promise


Promise 提供了完成和拒绝两个状态来标识异步操作结果，通过 then 和 catch 可以分别对着两个状态进行跟踪处理。和事件监听的主要差别在于：

1. 一个 Promise 只能成功或失败一次，一旦状态改变，就无法从成功切换到失败，反之亦然。
2. 如果 Promise 成功或失败，那么即使在事件发生之后添加成功/失败回调，也将调用正确的回调。


Promise 使用顺序的方式来表达异步，将回调的控制权转交给了可以信任的 Promise.resolve()，同时也能够使用链式流的方式避免回调地狱的产生，解决了异步回调的问题。但 Promise 也有缺陷：

1. 顺序错误处理：如果不设置回调函数，Promise 链中的错误很容易被忽略。
2. 单决议：Promise 只能被决议一次（完成或拒绝），不能很好地支持多次触发的事件及数据流（支持的[标准](https://streams.spec.whatwg.org/)正在制定中）。
3. 无法获取状态：处于 Pending 状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。
4. 无法取消：一旦创建了 Promise 并注册了完成/拒绝函数，不能取消执行。


### 5. 生成器 Generator


Generator 函数是 ES6 提供的一种异步编程解决方案，语法与传统函数完全不同，最大的特点就是可以控制函数的执行。简单示例如下：


```js
function* helloHzfeGenerator() {
  yield "hello";
  yield "hzfe";
  return "ending";
}

var hello = helloHzfeGenerator();

hello.next();
// { value: 'hello', done: false }

hello.next();
// { value: 'hzfe', done: false }

hello.next();
// { value: 'ending', done: true }

hello.next();
// { value: undefined, done: true }
```


生成器 Generator 并不像普通函数那样总是运行到结束，可以在运行当中通过 yield 来暂停并完全保持其状态，再通过 next 恢复运行。yield/next 不只是控制机制，也是一种双向消息传递机制。yield 表达式本质上是暂停下来等待某个值，next 调用会向被暂停的 yield 表达式传回一个值（或者是隐式的 undefined）。


生成器 Generator 保持了顺序、同步、阻塞的代码模式，同样解决了异步回调的问题。


### 6. async/await


async/await 属于 [ECMAScript 2017 JavaScript 版](https://262.ecma-international.org/8.0/)的一部分，使异步代码更易于编写和阅读。通过使用它们，异步代码看起来更像是同步代码。具有如下特点：

1. async/await 不能用于普通的回调函数。
2. async/await 与 Promise 一样，是非阻塞的。
3. async/await 使得异步代码看起来像同步代码。


async/await 也存在问题：await 关键字会阻塞其后的代码，直到 Promise 完成，就像执行同步操作一样。它可以允许其他任务在此期间继续运行，但自己的代码会被阻塞。解决方案是将 Promise 对象存储在变量中来同时开始，然后等待它们全部执行完毕。具体参照 [fast async await](https://mdn.github.io/learning-area/javascript/asynchronous/async-await/fast-async-await.html)。如果内部的 await 等待的异步任务之间没有依赖关系，且需要获取这些异步操作的结果，可以使用 Promise.allSettled() 同时执行这些任务并获得结果。


### 7. Web Worker


**Web Worker 为 JavaScript 创造了多线程环境**，允许主线程创建 Worker 线程，将一些任务分配给 Worker 线程运行，处理完后可以通过 postMessage 将结果传递给主线程。优点在于可以在一个单独的线程中执行费时的处理任务，从而允许主线程中的任务（通常是 UI）运行不被阻塞/放慢。


使用 Web Worker 时有以下三点需要注意的地方：

1. **在 Worker 内部无法访问主线程的任何资源**，包括全局变量，页面的 DOM 或者其他资源，因为这是一个完全独立的线程。
2. **Worker 和主线程间的数据传递通过消息机制进行**。使用 postMessage 方法发送消息；使用 onmessage 事件处理函数来响应消息。
3. **Worker 可以创建新的 Worker，新的 Worker 和父页面同源**。Worker 在使用 XMLHttpRequest 进行网络 I/O 时，XMLHttpRequest 的 responseXML 和 channel 属性会返回 null。


Web Worker 主要应用场景：

1. 处理密集型数学计算
2. 大数据集排序
3. 数据处理（压缩，音频分析，图像处理等）
4. 高流量网络通信


## 参考资料

1. [异步 JavaScript](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Asynchronous)
2. [使用 Web Worker](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Using_web_workers)
