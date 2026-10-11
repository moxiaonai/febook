# 浏览器跨域


## 相关问题

- 什么是跨域
- 为什么会跨域
- 为什么有跨域限制
- 怎么解决跨域


## 回答关键点


`CORS`[1] `同源策略`[2]


跨域问题的来源是浏览器为了**请求安全**而引入的基于**同源策略**的安全特性。当页面和请求的**协议**、**主机名**或**端口**不同时，浏览器判定两者不同源，即为跨域请求。需要注意的是跨域是**浏览器的限制**，服务端并不受此影响。当产生跨域时，我们可以通过 JSONP、CORS、postMessage 等方式解决。


## 知识点深入


### 1. 跨域问题的来源


跨域问题的来源是浏览器为了**请求安全**而引入的基于**同源策略（Same-origin policy）**的安全特性。同源策略是浏览器一个非常重要的安全策略，基于这个策略可以限制非同源的内容与当前页面进行交互，从而减少页面被攻击的可能性。


当页面和请求的**协议**、**主机名**或**端口**不同时，浏览器判定两者不同源，从而产生跨域。需要注意的是跨域是**浏览器的限制**，实际请求已经正常发出和响应了。


### 2. 如何判定跨域


![cors](../assets/126035945-024df466-a92f-4564-82c5-cb5d54d66466-9856f5694d.png)


如上图所示，一个 origin 由**协议（Protocol）**、**主机名（Host）**和**端口（Port）**组成，这三块也是同源策略的判定条件，只有当**协议**、**主机名**和**端口**都相同时，浏览器才判定两者是同源关系，否则即为跨域。


### 3. 跨域的解决方案


前端常见的跨域解决方案有 CORS、反向代理（Reverse Proxy）、JSONP 等。


#### 3.1 CORS (Cross-Origin Resource Sharing)


CORS 是目前最为广泛的解决跨域问题的方案。方案依赖服务端/后端在响应头中添加 `Access-Control-Allow-*` 头，告知浏览器端通过此请求。


**涉及到的端**


CORS 只需要服务端/后端支持即可，不涉及前端改动。


**具体实现方式**


CORS 将请求分为**简单请求（Simple Requests）**和**需预检请求（Preflighted requests）**，不同场景有不同的行为：


**简单请求**


不会触发预检请求的称为简单请求。当请求满足以下条件时就是一个简单请求：

- 请求方法：`GET`、`HEAD`、`POST`。
- 请求头：`Accept`、`Accept-Language`、`Content-Language`、`Content-Type`。
    - Content-Type 仅支持：`application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`。


**需预检请求**


当一个请求不满足以上简单请求的条件时，浏览器会自动向服务端发送一个 **OPTIONS** 请求，通过服务端返回的 `Access-Control-Allow-*` 判定请求是否被允许。


CORS 引入了以下几个以 `Access-Control-Allow-*` 开头：

- `Access-Control-Allow-Origin` 表示允许的来源
- `Access-Control-Allow-Methods` 表示允许的请求方法
- `Access-Control-Allow-Headers` 表示允许的请求头
- `Access-Control-Allow-Credentials` 表示允许携带认证信息


当请求符合响应头的这些条件时，浏览器才会发送并响应正式的请求。


#### 3.2 反向代理


反向代理解决跨域问题的方案依赖同源的服务端对请求做一个转发处理，将请求从跨域请求转换成同源请求。


**涉及到的端**


反向代理只需要服务端/后端支持，几乎不涉及前端改动，只用切换接口即可。


**具体实现方式**


反向代理的实现方式为在页面同域下配置一套反向代理服务，页面请求同域的服务端，服务端请求上游的实际的服务端，之后将结果返回给前端。


#### 3.3 JSONP


JSONP 是一个相对古老的跨域解决方案，只支持 GET 请求。主要是利用了浏览器加载 JavaScript 资源文件时不受同源策略的限制而实现跨域获取数据。


**涉及到的端**


JSONP 需要服务端和前端配合实现。


**具体实现方式**


JSONP 的原理是利用了浏览器加载 JavaScript 资源文件时不受同源策略的限制而实现的。具体流程如下：

1. 全局注册一个函数，例如：`window.getHZFEMember = (num) => console.log('HZFE Member: ' + num);`。
2. 构造一个请求 URL，例如：`https://hzfe.org/api/hzfeMember?callback=getHZFEMember`。
3. 生成一个 `<script>` 并把 `src` 设为上一步的请求 URL 并插入到文档中，如 `<script src="https://hzfe.org/api/hzfeMember?callback=getHZFEMember" />`。
4. 服务端构造一个 JavaScript 函数调用表达式并返回，例如：`getHZFEMember(17)`。
5. 浏览器加载并执行以上代码，输出 `HZFE Member: 17`。


#### 非常用方式

- **postMessage**
    - 即在两个 origin 下分别部署一套页面 A 与 B，A 页面通过 `iframe` 加载 B 页面并监听消息，B 页面发送消息。
- **window.name**
    - 主要是利用 `window.name` 页面跳转不改变的特性实现跨域，即 `iframe` 加载一个跨域页面，设置 `window.name`，跳转到同域页面，可以通过 `$('iframe').contentWindow.name` 拿到跨域页面的数据。
- **document.domain**
    - 可将相同一级域名下的子域名页面的 `document.domain` 设置为一级域名实现跨域。
    - 可将同域不同端口的 `document.domain` 设置为同域名实现跨域（端口被置为 null）。


## 扩展阅读


### 1. LocalStorage / SessionStorage 跨域


LocalStorage 和 SessionStorage 同样受到同源策略的限制。而跨域读写的方式也可以使用前文提到的 postMessage。


### 2. 跨域与监控


前端项目在统计前端报错监控时会遇到上报的内容只有 `Script Error` 的问题。这个问题也是由同源策略引起。在 `<script>` 标签上添加 `crossorigin="anonymous"` 并且返回的 JS 文件响应头加上 `Access-Control-Allow-Origin: *` 即可捕捉到完整的错误堆栈。


### 3. 跨域与图片


前端项目在图片处理时可能会遇到图片绘制到 Canvas 上之后却不能读取像素或导出 base64 的问题。这个问题也是由同源策略引起。解决方式和上文相同，给图片添加 `crossorigin="anonymous"` 并在返回的图片文件响应头加上 `Access-Control-Allow-Origin: *` 即可解决。


## 参考资料

1. [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
2. [Same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)
