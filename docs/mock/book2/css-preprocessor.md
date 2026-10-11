# 谈谈 CSS 预处理器


## 相关问题

- CSS 主要有哪些预处理器
- 为什么需要用预处理器
- 各预处理器优缺点


## 回答关键点


`Sass` `Less` `Stylus` `PostCSS` `工程化` `提升效率`


CSS 本身不属于可编程语言，当前端项目逐渐庞大之后 CSS 的维护也愈加困难。CSS 预处理器所做的本质上是为 CSS 增加一些可编程的特性，通过**变量**、**嵌套**、**简单的程序逻辑**、**计算**、**函数**等特性，通过**工程化**的手段让 CSS 更易维护，提升开发效率。


目前主流的 CSS 预处理器主要有 Sass、Less、Stylus、PostCSS。


## 知识点深入


### 1. PostCSS[1]


PostCSS 是目前最为流行的 CSS 预/后处理器。PostCSS 本体功能比较单一，它提供一种用 JavaScript 来处理 CSS 的方式。PostCSS 会把 CSS 解析成 AST（Abstract Syntax Tree 抽象语法树），之后由其他插件进行不同的处理。


#### 功能


PostCSS 本体功能比较单一，大多数的 CSS 处理功能都由插件提供，下面是一些常用的插件：

- [Autoprefixer](https://github.com/postcss/autoprefixer) 为 CSS 中的属性添加浏览器特定的前缀。
- [postcss-preset-env](https://github.com/csstools/postcss-preset-env) 根据 `browserslist` 指定的目标浏览器将一些 CSS 的新特性转换为目标浏览器所支持的语法。
- [cssnano](https://github.com/cssnano/cssnano) 提供 CSS 压缩功能。
- [postcss-nested](https://github.com/postcss/postcss-nested) 提供 CSS 嵌套功能。
- [postcss-px-to-viewport](https://github.com/evrone/postcss-px-to-viewport) 提供 px 转 vw 功能。
- [postcss-custom-properties](https://github.com/postcss/postcss-custom-properties) 支持 CSS 的自定义属性。


#### 优点

- 插件系统完善，扩展性强。
- 配合插件功能齐全。
- 生态优秀。


#### 缺点

- 配置相对复杂。


### 2. Sass[2]


Sass 在完全兼容 CSS 语法的前提下，给 CSS 提供了变量、嵌套、混合、操作符、自定义函数等可编程能力。


#### 功能


Sass 常用的有几种功能：

- 变量：变量中可以存储颜色、字体或任何 CSS 值。
- 嵌套：可嵌套 CSS 选择器，提供清晰的层次结构。
- 混合：可以定义&重用代码块。
- 扩展/集成：可以在一个选择器内继承另一个选择器。
- 操作符：可以在 CSS 中使用操作符进行计算。
- 条件/循环语句：可以循环/条件生成 CSS。
- 自定义函数：可以自定义复杂操作的函数。


#### 优点

- 使用广泛。
- 功能支持完善。
- 可编程能力强。


#### 缺点

- CSS 的复杂度不可控。
- node-sass 国内安装不易（非 Sass 本身的缺点，dart-sass 可代替）。


### 3. Less[3]


Less 和 Sass 类似，完全兼容 CSS 语法，并给 CSS 提供了变量、嵌套、混合、运算等可编程能力。Less 通过 JavaScript 实现，可在浏览器端直接使用。


#### 功能


Less 常用的有几种功能：

- 变量：变量中可以存储颜色、字体或任何 CSS 值。
- 嵌套：可嵌套 CSS 选择器，提供清晰的层次结构。
- 混合：可以定义&重用的代码块。
- 扩展/集成：可以在一个选择器内继承另一个选择器。
- 运算：可以在 CSS 中进行计算。
- 条件/循环语句：可以循环/条件生成 CSS。


#### 优点

- 使用广泛。
- 可以在浏览器中运行，容易实现主题定制功能。


#### 缺点

- 不支持自定义函数（可通过 mixins 实现简单逻辑）。
- 编程能力相对较弱。


### 4. Stylus[4]


Stylus 基础功能和 Sass / Less 十分类似。Stylus 的特点是冒号、分号、逗号和括号都是可选项，所以可以写出非常简洁的 CSS，示例如下：


```stylus
body
  background-color: #000

body::after
  content: 'HZFEStudio'
  color: #fff
  font-size: 20px
```


## 扩展阅读


### 1. CSS Modules[5]


CSS Modules 和前文介绍的预处理器不同，不是可编程化的 CSS，而仅是给 CSS 文件加入了作用域和模块依赖，主要是为了解决 CSS 全局污染的痛点以及为了解决全局污染而嵌套过深的问题。使用示例如下：


```css
/* style.css */
.hzfeTitle {
  color: #666;
  font-size: 20px;
}
```


```js
import style from "./style.css";

document.body.innerHTML = `<h1 class="${style.hzfeTitle}">HZFEStudio</h1>`;
```


### 2. CSS-in-JS


如名字所见，CSS-in-JS 是一种在 JavaScript 里写 CSS 的方式。利用 JS 的优势可实现非常灵活的可扩展的样式。CSS-in-JS 有很多实现，目前比较流行的是 [Styled-components](https://www.styled-components.com/)。


通过 Styled-components 写 CSS 的示例如下：


```js
import React from "react";
import styled from "styled-components";

function hzfe() {
  const Title = styled.h1`
    font-size: 1.5em;
    text-align: center;
    color: #666;
  `;
  return <Title>HZFEStudio</Title>;
}
```


### 3. Tailwind 和 Utility-first CSS


近几年随着 Tailwind 的流行，功能类优先（Utility-first CSS）的理念也再次流行起来。这里简单介绍一下 Tailwind CSS。


#### 3.1 Tailwind[6]


Tailwind CSS 是一个功能类优先的 CSS 框架，通过组合不同的类名实现页面设计。Tailwind 主要优势如下：

1. 不用考虑 class 的命名。
2. CSS 文件大小增长可控，通过 `purge` 可生成非常小的 CSS 文件。
3. 统一设计系统下的样式与布局。
4. IDE 集成优秀。


## 参考资料

1. [PostCSS - A tool for transforming CSS with JavaScript](https://postcss.org/)
2. [Sass - CSS with superpowers](https://sass-lang.com/)
3. [Less - It's CSS, with just a little more](https://lesscss.org/)
4. [Stylus - Foresight has never been so crucial](https://stylus-lang.com/)
5. [CSS Modules](https://github.com/css-modules/css-modules)
6. [Tailwind CSS](https://tailwindcss.com/)
