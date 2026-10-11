# 实现 apply/call/bind


## apply


### 1. 语法


```jsx
func.apply(thisArg, [argsArray]);
```


**参数**


`thisArg`


在 func 函数运行时使用的 this 值。


`argsArray`


一个数组或者类数组对象，其中的数组元素将作为单独的参数传给 func 函数。如果该参数的值为 null 或 undefined，则表示不需要传入任何参数。


**返回值**


使用指定的 this 值和参数调用函数的结果。


### 2. 流程图


![apply](../assets/147632530-34eac628-0bbd-4025-890b-2596a421263d-cb6a3d2f18.jpg)


### 3. 编写代码


```jsx
Function.prototype.apply = function (thisArg, argsArray) {
  if (typeof this !== "function") {
    throw new TypeError(
      "Function.prototype.apply was called on which is not a function"
    );
  }

  if (thisArg === undefined || thisArg === null) {
    thisArg = window;
  } else {
    thisArg = Object(thisArg);
  }

  // 将 func 放入 thisArg 内，这样在调用 thisArg[func] 时 this 自然就指向了 thisArg
  const func = Symbol("func");
  thisArg[func] = this;

  let result;

  if (argsArray && typeof argsArray === "object" && "length" in argsArray) {
    // 此处使用 Array.from 包裹让其支持形如 { length: 1, 0: 1 } 这样的类数组对象，直接对 argsArray 展开将会执行出错
    result = thisArg[func](...Array.from(argsArray));
  } else if (argsArray === undefined || argsArray === null) {
    result = thisArg[func]();
  } else {
    throw new TypeError("CreateListFromArrayLike called on non-object");
  }

  delete thisArg[func];

  return result;
};
```


## call


### 1. 语法


```jsx
func.call(thisArg, arg1, arg2, ...)
```


**参数**


`thisArg`


在 func 函数运行时使用的 this 值。


`arg1, arg2, ...`


指定的参数列表。


**返回值**


使用指定的 this 值和参数调用函数的结果。


### 2. 流程图


![call](../assets/147632668-575c348e-96f5-4088-8cee-38e3ee70a2cc-fc3ce0e09a.jpg)


### 3. 编写代码


```jsx
Function.prototype.call = function (thisArg, ...argsArray) {
  if (typeof this !== "function") {
    throw new TypeError(
      "Function.prototype.call was called on which is not a function"
    );
  }

  if (thisArg === undefined || thisArg === null) {
    thisArg = window;
  } else {
    thisArg = Object(thisArg);
  }

  // 将 func 放入 thisArg 内，这样在调用 thisArg[func] 时 this 自然就指向了 thisArg
  const func = Symbol("func");
  thisArg[func] = this;

  let result;

  if (argsArray.length) {
    result = thisArg[func](...argsArray);
  } else {
    result = thisArg[func]();
  }

  delete thisArg[func];

  return result;
};
```


## bind


### 1. 语法


```jsx
func.bind(thisArg[, arg1[, arg2[, ...]]])
```


**参数**


`thisArg`


调用绑定函数时作为 this 参数传递给目标函数的值。 如果使用 new 运算符构造绑定函数，则忽略该值。


`arg1, arg2, ...`


当目标函数被调用时，被预置入绑定函数的参数列表中的参数。


**返回值**


返回一个原函数的拷贝，并拥有指定的 this 值和初始参数。


### 2. 流程图


![bind](../assets/147632692-d7d335a7-a236-4bee-85a6-51aedbf285b9-38d4bf6a17.jpg)


### 3. 编写代码


```jsx
Function.prototype.bind = function (thisArg, ...argsArray) {
  if (typeof this !== "function") {
    throw new TypeError(
      "Function.prototype.bind was called on which is not a function"
    );
  }

  if (thisArg === undefined || thisArg === null) {
    thisArg = window;
  } else {
    thisArg = Object(thisArg);
  }

  const func = this;

  const bound = function (...boundArgsArray) {
    let isNew = false;

    // 如果 func 不是构造器，直接使用 instanceof 将出错，所以需要用 try...catch 包裹
    try {
      isNew = this instanceof func;
    } catch (error) {}

    return func.apply(isNew ? this : thisArg, argsArray.concat(boundArgsArray));
  };

  const Empty = function () {};
  Empty.prototype = this.prototype;
  bound.prototype = new Empty();

  return bound;
};
```


## 参考资料

1. [Function.prototype.apply()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)
2. [Function.prototype.call()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call)
3. [Function.prototype.bind()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
