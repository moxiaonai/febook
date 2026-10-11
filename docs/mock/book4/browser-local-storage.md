# 本地存储方式及场景


## 相关问题

- cookie 的优缺点
- cookie、Web Storage 以及 IndexedDB 区别


## 回答关键点


`cookie` `Web Storage` `IndexedDB`


浏览器本地存储主要分为 cookie、Web Storage 以及 IndexedDB。其中 Web Storage 又可以分为 sessionStorage 和 localStorage。

- cookie：为了辨别用户身份而储存在客户端上的数据（通常经过加密）。cookie 通常由服务端生成，客户端维护，主要用于维持用户的状态。cookie 会随请求发送给服务器。
- Web Storage：以键值对的形式来存储数据，提供除 cookie 之外存储会话数据的途径。存储限制大于 cookie。
    - sessionStorage：可存储会话数据。
    - localStorage：同域之间，可跨会话的持久存储数据。
- IndexedDB：能存储大量结构化数据，适用于高性能搜索场景。


## 知识点深入


### 1. cookie


cookie 通常由服务端生成，发送到客户端。客户端会将其存储起来，之后请求对应的服务端时带上。cookie 可以用于标识客户端，能够让使用无状态 HTTP 协议的服务器记住状态信息。


#### 1.1 使用场景

1. 会话状态管理（如用户登录状态、购物车、游戏分数或其它需要记录的信息）。
2. 个性化设置（如用户自定义设置、主题等）。
3. 浏览器行为跟踪（如跟踪分析用户行为等）。


#### 1.2 相关属性


在收到 HTTP 请求时，服务端可以通过在响应头中增加 Set-Cookie 字段来告诉客户端存储对应的 cookie，前端也可以通过 JavaScript 来设置 cookie。之后向相同的服务端发送请求时，存储的 cookie 会作为请求头 Cookie 字段的值一起发送出去。可以通过不同属性的设置来让 cookie 拥有不同的特性：

- Expires 属性用于设置过期时间，Max-Age 用于设置有效时间段，过期后 cookie 会被删除。
- Secure 属性代表 cookie 只会随 HTTPS 请求发送。
- HttpOnly 属性代表 cookie 只用于发送给服务端，无法被 JavaScript 访问。
- Domain 属性设置可接收 cookie 的 hosts，不设置则默认为当前 host。如果设置了 Domain，子域名也被包含在内。
- Path 属性设置可接收 cookie 的 URL path，只有包含指定路径的 url 请求才会带上 cookie。如设置为 “/”，则子路径也包含在内。
- SameSite 属性表示跨域时 cookie 的处理策略，包括 `Strict`, `Lax` 和 `None`。
    - Strcit：cookie 只会在第一方上下文中发送，不会与第三方网站发起的请求一起发送。
    - Lax：cookie 允许与顶级导航一起发送，并将与第三方网站发起的 GET 请求一起发送，这也是浏览器的默认值。
    - None：cookie 将在所有上下文中发送，即允许跨域发送。使用 None 时，需在最新的浏览器版本中同时使用 Secure 属性，否则会报错。


#### 1.3 优点

1. 简单易用。
2. 不占用服务器资源。
3. 可设置过期时间，提升安全性。


#### 1.4 缺点

1. cookie 会被添加在每个请求中，增加了流量消耗。
2. cookie 在 HTTP 请求中是明文传输的，不够安全，使用 HTTPS 可避免该问题。
3. cookie 大小限制在 4KB，复杂场景会不够用。


### 2. sessionStorage


sessionStorage 对象是当前源（和同源策略中的源一致，下同）下，存储会话数据的 Storage 实例。生命周期同当前页面保持一致，页面关闭时 sessionStorage 会被清空。sessionStorage 以键值对的方式存储数据，键值以字符串存储。


#### 2.1 特点

1. sessionStorage 只能被当前标签页访问。
2. 页面 sessionStorage 的生命周期和浏览器行为相关：关闭浏览器或标签页清除 sessionStorage，刷新标签页或恢复浏览器页面时保留 sessionStorage。
3. 在页面触发打开新页面时，会复制会话上下文作为新会话的上下文。
4. 复制标签页（浏览器标签右键菜单中的复制，非复制 URL）时会复制当前 sessionStorage 到新的标签页中。


#### 2.2 使用场景


sessionStorage 更适合用来存储生命周期和它同步的会话级别的信息。


### 3. localStorage


localStorage 同样也是获取当前源存储的 Storage 对象。存储的数据可以跨浏览器会话访问。


#### 3.1 和 sessionStorage 区别

1. localStorage 没有过期时间（隐私窗口中的 localStorage 在最后一个隐私窗口关闭时会被清空）。
2. StorageEvent 只能监听同源页面的 localStorage 的改变，无法监听 sessionStorage 的改变。


#### 3.2 使用场景


理论上 cookie 无法胜任的，可以用简单的键值对来存取的数据存储任务，都可以使用 localStorage 来处理。


### 4. IndexedDB


IndexedDB 是一种底层 API，用于在客户端存储大量的结构化数据（也包括 File 和 Blob 对象）。该 API 使用索引实现对数据的高性能搜索，使用上接近于数据库。能够解决 Web Storage 在存储大量的结构化数据时存储容量小，搜索速度慢等问题。


#### 4.1 特点

1. 键值对存储
2. 遵守同源策略
3. 支持二进制存储：不仅可以存储字符串，也可以存储 File 或 Blob 对象。
4. 同步与异步：IndexedDB 操作默认为异步操作。IndexedDB 也有用于 Web Worker 的同步 API，但因为不清楚是都需要目前已从规范中移除，有相关需求时可以引入。
5. 存储空间大：IndexedDB 的最大存储空间是动态的，取决于硬盘大小，最大空间取决于浏览器的实现。


#### 4.2 使用场景

1. 存储数据量很大
2. 存储数据为结构化数据
3. 对数据搜索有性能要求


#### 4.3 使用须知


IndexedDB 功能虽然很强大，但相关 API 使用起来相对来说比较复杂，需要一定的数据库开发经验，在应对简单场景时开发成本过高。


### 5. cookie、Web Storage（sessionStroage/localStorage） 以及 IndexedDB 区别


共同点：都是保存数据于浏览器端，遵循同源策略。


不同点：生命周期，存储空间最大值及与服务端交互方式。


| 特性 | cookie | sessionStorage | localStorage | IndexedDB |
| --- | --- | --- | --- | --- |
| 生命周期 | 可设置失效时间，默认为浏览器会话结束时清除 cookie | 页面会话结束时清除 sessionStorage | 持久存储 | 永久保存 |
| 存储空间最大值 | 4KB | 一般为 5MB | 同 sessionStorage | 取决于用户设备容量和浏览器限额设置 |
| 是否与服务端交互 | 随请求发送给服务端，可设置多种属性控制 | 保存在浏览器端，不与服务端交互 | 同 sessionStorage | 保存在浏览器端，不与服务端交互 |


## 拓展阅读


### 1. Cache API


Cache API 为缓存的 Request/Response 对象提供存储机制。Cache API 和 workers 一样，是暴露在 Window 作用域下的，虽然被定义在 service worker 标准中，但是也可以脱离 service worker 单独使用。


#### 1.1 特点

1. Window 和 WorkerGlobalScope 都提供了 caches 对象，caches 提供了一系列异步方法，可以创建和操作 Cache 对象。
2. 一个源可以有多个不同名称的 Cache 对象，同一域名下的 cacheName + Cache 由同一 name to cache map 管理。
3. Cache 不能在不同域名之间共享，完全独立于浏览器的 HTTP cache，但同一域名下的 Window 对象和 ServiceWorker 对象可以共用。
4. Cache 完全由开发者控制，增加、删除、更新等操作都需要由开发者去执行。由于浏览器都硬性限制了一个域下缓存数据的大小，需要定期清理缓存条目。


#### 1.2 使用场景


ServiceWorker 或对离线体验要求较高的场景比较适合使用 Cache API。


#### 1.3 使用须知

1. Cache.put, Cache.add 和 Cache.addAll 只能在 GET 请求下使用。
2. 自 Chrome 46 版本起，Cache API 不支持 HTTP 请求，只保存 HTTPS 请求。
3. 匹配算法主要取决于缓存值中的 VARY Header，因此匹配新的 key 时需要查看缓存中条目的键和值。


## 参考资料

1. [Client-side storage](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Client-side_storage)
2. [HTTP cookie](https://en.wikipedia.org/wiki/HTTP_cookie)
3. [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
4. [Cache](https://developer.mozilla.org/en-US/docs/Web/API/Cache)
