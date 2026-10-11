# 水平垂直居中方案


以下方案均基于如下布局和基础样式：


```html
<div id="parent">
  <div id="children">HZFE</div>
</div>
```


```css
#parent {
  background: red;
  height: 600px;
}

#children {
  background: blue;
}
```


## flex


适用场景：子元素宽高不固定、子元素宽高固定


```css
#parent {
  display: flex;
  justify-content: center;
  align-items: center;
}
```


## grid


适用场景：子元素宽高不固定、子元素宽高固定


```css
#parent {
  display: grid;
  justify-content: center;
  align-items: center;
}
```


## 相对定位


### 1. transform


适用场景：子元素宽高不固定、子元素宽高固定


```css
#children {
  display: inline-block;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```


适用场景：子元素宽高固定


```css
#children {
  width: 400px;
  height: 300px;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-200px, -150px);
}
```


### 2. calc


适用场景：子元素宽高固定


```css
#children {
  width: 400px;
  height: 300px;
  position: relative;
  top: calc(50% - 150px);
  left: calc(50% - 200px);
}
```


## 绝对定位


### 1. transform


适用场景：子元素宽高不固定、子元素宽高固定


```css
#parent {
  position: relative;
}

#children {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```


适用场景：子元素宽高固定


```css
#parent {
  position: relative;
}

#children {
  width: 400px;
  height: 300px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-200px, -150px);
}
```


### 2. calc


适用场景：子元素宽高固定


```css
#parent {
  position: relative;
}

#children {
  width: 400px;
  height: 300px;
  position: absolute;
  top: calc(50% - 150px);
  left: calc(50% - 200px);
}
```


### 3. 负外边距


适用场景：子元素宽高固定


```css
#parent {
  position: relative;
}

#children {
  width: 400px;
  height: 300px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -150px;
  margin-left: -200px;
}
```


### 4. 自动外边距


适用场景：子元素宽高固定


```css
#parent {
  position: relative;
}

#children {
  width: 400px;
  height: 300px;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
}
```


## table-cell


适用场景：子元素宽高不固定、子元素宽高固定


```css
#parent {
  width: 800px;
  display: table-cell;
  text-align: center;
  vertical-align: middle;
}

#children {
  display: inline-block;
}
```


## line-height


前提：父元素高度固定


适用场景：子元素宽高不固定、子元素宽高固定


```css
#parent {
  line-height: 600px;
  text-align: center;
}

#children {
  line-height: 1.5;
  display: inline-block;
  vertical-align: middle;
}
```
