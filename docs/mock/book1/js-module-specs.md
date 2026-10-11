# 前端模块化规范


## 相关问题

- JavaScript 主要有哪几种模块化规范
- AMD / CMD 有什么异同
- ESM 是什么
- 模块化解决了什么问题/痛点


## 回答关键点


`CommonJS` `AMD` `CMD` `UMD` `ESM`

- CommonJS[1]: 主要是 **Node.js** 使用，通过 `require` **同步**加载模块，`exports` 导出内容。
- AMD[2]: 主要是**浏览器端**使用，通过 `define` 定义模块和依赖，`require` **异步**加载模块，推崇**依赖前置**。
- CMD[3]: 和 AMD 比较类似，主要是**浏览器端**使用，通过 `require` **异步**加载模块，`exports` 导出内容，推崇**依赖就近**。
- UMD[4]: 通用模块规范，是 CommonJS、AMD 两个规范的大融合，是**跨平台**的解决方案。
- ESM[5]: 官方模块化规范，**现代浏览器原生支持**，通过 `import` **异步**加载模块，`export` 导出内容。


## 知识点深入


### 1. 为什么需要模块化和模块化规范


模块化可以解决代码之间的变量、函数、对象等命名的**冲突/污染**问题，良好的模块化设计可以**降低代码之间的耦合关系**，提高代码的可维护性、可扩展性以及复用性。


模块化规范的作用是为了规范 JavaScript 模块的定义和加载机制，以统一的方式导出和加载模块，降低学习使用成本，提高开发效率。


### 2. 各种模块化规范的细节


#### 2.1 CommonJS


CommonJS 主要是 **Node.js** 使用，通过 `require` **同步**加载模块，`exports` 导出内容。在 CommonJS 规范下，每一个 JS 文件都是独立的模块，每个模块都有独立的作用域，模块里的本地变量都是私有的。


**示例**


```js
// hzfe.js
const hzfeMember = 17;
const getHZFEMember = () => {
  return `HZFE Member: ${hzfeMember}`;
};
module.exports.getHZFEMember = getHZFEMember;

// index.js
const hzfe = require("./hzfe.js");
console.log(hzfe.getHZFEMember()); // HZFE Member: 17
```


**使用场景**


CommonJS 主要在服务端（如：Node.js）使用，也可通过打包工具打包之后在浏览器端使用。


**加载方式**


CommonJS 通过同步的方式加载模块，首次加载会缓存结果，后续加载则是直接读取缓存结果。


**优缺点**


优点

- 简单易用
- 可以在任意位置 `require` 模块
- 支持循环依赖


缺点

- 同步的加载方式不适用于浏览器端
- 浏览器端使用需要打包
- 难以支持模块静态分析


#### 2.2 AMD (Asynchronous Module Definition)


AMD，即异步模块定义。AMD 定义了一套 JavaScript 模块依赖异步加载标准，用来解决浏览器端模块加载的问题。AMD 主要是**浏览器端**使用，通过 `define` 定义模块和依赖，`require` **异步**加载模块，推崇**依赖前置**。


AMD 模块通过 `define` 函数定义在闭包中：


```ts
/**
 * define
 * @param id 模块名
 * @param dependencies 依赖列表
 * @param factory 模块的具体内容/具体实现
 */
define(id?: string, dependencies?: string[], factory: Function | Object);
```


**示例**


```js
// hzfe.js
define("hzfe", [], function () {
  const hzfeMember = 17;
  const getHZFEMember = () => {
    return `HZFE Member: ${hzfeMember}`;
  };

  return {
    getHZFEMember,
  };
});

// index.js
require(["hzfe"], function (hzfe) {
  // 依赖前置
  console.log(hzfe.getHZFEMember()); // HZFE Member: 17
});
```


**使用场景**


AMD 主要在**浏览器端**中使用，通过符合 AMD 标准的 JavaScript 库（如：RequireJs）加载模块。


**加载方式**


AMD 通过异步的方式加载模块，每加载一个模块实际就是加载对应的 JS 文件。


**优缺点**


优点

- 依赖异步加载，更快的启动速度
- 支持循环依赖
- 支持插件


缺点

- 语法相对复杂
- 依赖加载器
- 难以支持模块静态分析


**具体实现**

- [RequireJs](https://requirejs.org/)


#### 2.3 CMD (Common Module Definition)


CMD，即通用模块定义。CMD 定义了一套 JavaScript 模块依赖异步加载标准，用来解决浏览器端模块加载的问题。CMD 主要是**浏览器端**使用，通过 `define` 定义模块和依赖，`require` **异步**加载模块，推崇**依赖就近**。


CMD 模块通过 `define` 函数定义在闭包中：


```ts
/**
 * define
 * @param id 模块名
 * @param dependencies 依赖列表
 * @param factory 模块的具体内容/具体实现
 */
define(id?: string, dependencies?: string[], factory: Function | Object);
```


**示例**


```js
// hzfe.js
define("hzfe", [], function () {
  const hzfeMember = 17;
  const getHZFEMember = () => {
    return `HZFE Member: ${hzfeMember}`;
  };

  exports.getHZFEMember = getHZFEMember;
});

// index.js
define(function (require, exports) {
  const hzfe = require("hzfe"); // 依赖就近
  console.log(hzfe.getHZFEMember()); // HZFE Member: 17
});
```


**使用场景**


CMD 主要在**浏览器端**中使用，通过符合 CMD 标准的 JavaScript 库（如 sea.js）加载模块。


**加载方式**


CMD 通过异步的方式加载模块，每加载一个模块实际就是加载对应的 JS 文件。


**优缺点**


优点

- 依赖异步加载，更快的启动速度
- 支持循环依赖
- 依赖就近
- 与 CommonJS 保持很大的兼容性


缺点

- 语法相对复杂
- 依赖加载器
- 难以支持模块静态分析


**具体实现**

- [Sea.js](https://github.com/seajs/seajs)


#### 2.4 UMD (Universal Module Definition)


UMD，即通用模块定义。UMD 主要为了解决 CommonJS 和 AMD 规范下的代码不通用的问题，同时还支持将模块挂载到全局，是**跨平台**的解决方案。


**示例**


```js
// hzfe.js
(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    // AMD
    define(["exports", "hzfe"], factory);
  } else if (
    typeof exports === "object" &&
    typeof exports.nodeName !== "string"
  ) {
    // CommonJS
    factory(exports, require("hzfe"));
  } else {
    // Browser globals
    factory((root.commonJsStrict = {}), root.hzfe);
  }
})(typeof self !== "undefined" ? self : this, function (exports, b) {
  const hzfeMember = 17;
  const getHZFEMember = () => {
    return `HZFE Member: ${hzfeMember}`;
  };

  exports.getHZFEMember = getHZFEMember;
});

// index.js
const hzfe = require("./hzfe.js");
console.log(hzfe.getHZFEMember()); // HZFE Member: 17
```


**使用场景**


UMD 可同时在服务器端和浏览器端使用。


**加载方式**


UMD 加载模块的方式取决于所处的环境，Node.js 同步加载，浏览器端异步加载。


**优缺点**


优点

- 跨平台兼容


缺点

- 代码量稍大


#### 2.5 ESM (ECMAScript Module)


ESM，即 ESModule、ECMAScript Module。官方模块化规范，**现代浏览器原生支持**，通过 `import` 加载模块，`export` 导出内容。
**示例**


```js
// hzfe.js
const hzfeMember = 17;
export const getHZFEMember = () => {
  return `HZFE Member: ${hzfeMember}`;
};

// index.js
import * as hzfe from "./hzfe.js";
console.log(hzfe.getHZFEMember()); // HZFE Member: 17
```


**使用场景**


ESM 在支持的浏览器环境下可以直接使用，在不支持的端需要编译/打包后使用。


**加载方式**


ESM 加载模块的方式同样取决于所处的环境，Node.js 同步加载，浏览器端异步加载。


**优缺点**


优点

- 支持同步/异步加载
- 语法简单
- 支持模块静态分析
- 支持循环引用


缺点

- 兼容性不佳


## 扩展阅读


### 1. 静态分析


> 静态程序分析（Static program analysis）是指在不运行程序的条件下，进行程序分析的方法。 [静态程序分析 - Wiki](https://zh.wikipedia.org/wiki/%E9%9D%9C%E6%85%8B%E7%A8%8B%E5%BA%8F%E5%88%86%E6%9E%90)


简而言之，前文里提到的静态分析就是指在运行代码之前就可判断出代码内有哪些代码使用到了，哪些没有使用到。


### 2. 模块化与工程化：webpack


webpack 同时支持 CommonJS、AMD 和 ESM 三种模块化规范的打包。根据不同规范 webpack 会将模块处理成不同的产物。


CommonJS


```js
(function (module, exports) {
  const hzfeMember = 17;
  const getHZFEMember = () => {
    return `HZFE Member: ${hzfeMember}`;
  };

  module.exports = getHZFEMember;
});
```


AMD


```js
(function (module, exports, __webpack_require__) {
  var __WEBPACK_AMD_DEFINE_ARRAY__, // 依赖列表
    __WEBPACK_AMD_DEFINE_RESULT__; // factory 返回值

  __WEBPACK_AMD_DEFINE_ARRAY__ = [];

  // 执行 factory
  __WEBPACK_AMD_DEFINE_RESULT__ = function () {
    const hzfeMember = 17;
    const getHZFEMember = () => {
      return `HZFE Member: ${hzfeMember}`;
    };

    return {
      getHZFEMember,
    };
  }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__);

  __WEBPACK_AMD_DEFINE_RESULT__ !== undefined &&
    (module.exports = __WEBPACK_AMD_DEFINE_RESULT__);
});
```


ESM


```js
(function (module, __webpack_exports__, __webpack_require__) {
  __webpack_require__.r(__webpack_exports__);
  __webpack_require__.d(__webpack_exports__, "getHZFEMember", function () {
    return getHZFEMember;
  });

  const hzfeMember = 17;
  const getHZFEMember = () => {
    return `HZFE Member: ${hzfeMember}`;
  };
});
```


### 3. 模块化与工程化：Tree Shaking


> Tree Shaking 是一个通常用于描述移除 JavaScript 上下文中的未引用代码（dead-code）行为的术语。它依赖于 ES2015 中的 import 和 export 语句，用来检测代码模块是否被导出、导入，且被 JavaScript 文件使用。 [Tree Shaking - MDN](https://developer.mozilla.org/zh-CN/docs/Glossary/Tree_shaking)


简单来说，Tree Shaking 是一种依赖 ESM 模块静态分析实现的功能，它可以在编译时安全的移除代码中未使用的部分（webpack 5 对 CommonJS 也进行了支持，在此不详细展开）。


## 参考资料

1. [Modules: CommonJS modules](https://nodejs.org/api/modules.html#modules_modules_commonjs_modules)
2. [Asynchronous module definition](https://en.wikipedia.org/wiki/Asynchronous_module_definition)
3. [Common Module Definition](https://github.com/seajs/seajs/issues/242)
4. [Universal Module Definition](https://github.com/umdjs/umd/)
5. [Modules: ECMAScript modules](https://nodejs.org/api/modules.html#modules_modules_commonjs_modules)
6. [Module Semantics](https://tc39.es/ecma262/#sec-modules)
