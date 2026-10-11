# 浏览器渲染机制


## 相关问题

- 浏览器如何渲染页面
- 有哪些提高浏览器渲染性能的方法


## 回答关键点


`DOM` `CSSOM` `脚本执行与界面渲染互斥` `渲染树` `Compositing` `GPU 加速`


当浏览器进程获取到 HTML 的第一个字节开始，会通知渲染进程开始解析 HTML，将 HTML 转换成 DOM 树，并进入渲染流程。一般所有的浏览器都会经过五大步骤，分别是：

1. PARSE：解析 HTML，构建 DOM 树。
2. STYLE：为每个节点计算最终的有效样式。
3. LAYOUT：为每个节点计算位置和大小等布局信息。
4. PAINT：绘制不同的盒子，为了避免不必要的重绘，将会分成多个层进行处理。
5. COMPOSITE & RENDER：将上述不同的层合成为一张位图，发送给 GPU，渲染到屏幕上。


为了提高浏览器的渲染性能，通常的手段是保证渲染流程不被阻塞，避免不必要的绘制计算和重排重绘，利用 GPU 硬件加速等技术来提高渲染性能。


## 知识点深入


### 1. 浏览器的渲染流程


Chromium 的渲染流程的主要步骤如下图所示：


![render flow](../assets/131218930-b923183d-a4d4-44da-9f53-f074a3583a8f-9e0e4f4440.png)


> 图片来源 [Life of a Pixel](https://docs.google.com/presentation/d/1boPxbgNrTU0ddsc144rcXayGA_WF53k96imRH8Mp34Y/edit#slide=id.ga884fe665f_64_1800)


#### 1.1 Parse 阶段：解析 HTML


**构建 DOM 树**


渲染进程主线程解析 HTML 并构建出结构化的树状数据结构 DOM 树，需要经历以下几个步骤：

1. Conversion（转换）：浏览器从网络或磁盘读取 HTML 文件原始字节，根据指定的文件编码（如 UTF-8）将字节转换成字符。
2. Tokenizing（分词）：浏览器根据 HTML 规范将字符串转换为不同的标记（如 `<html>`, `<body>`）。
3. Lexing（语法分析）：上一步产生的标记将被转换为对象，这些对象包含了 HTML 语法的各种信息，如属性、属性值、文本等。
4. DOM construction（DOM 构造）：因为 HTML 标记定义了不同标签之间的关系，上一步产生的对象会链接在一个树状数据结构中，以标识父子、兄弟关系。


构建 DOM 的流程如下图所示：


![DOM](../assets/166937878-3e069cd9-631e-47a7-84af-4b5c124d73c9-7accd2eb19.png)


> 图片来源 [Constructing the Object Model](https://web.dev/critical-rendering-path-constructing-the-object-model/)


**次级资源加载**


一个网页通常会使用多个外部资源，如图片、JavaScript、CSS、字体等。主线程在解析 DOM 的过程中遇到这些资源后会一一请求。为了加速渲染流程，会有一个叫做预加载扫描器（preload scanner）线程并发运行。如果 HTML 中存在 img 或 link 之类的内容，则预加载扫描器会查看 HTML parser 生成的标记，并发送请求到浏览器进程的网络线程获取这些资源。


**JavaScript 可能阻塞解析**


当 HTML 解析器发现 script 标签时，会暂停 HTML 的解析，转而开始加载、解析和执行 JavaScript。因为 JS 可能会改变 DOM 的结构。如果不想因 JS 阻塞 HTML 的解析，可以为 script 标签添加 defer 属性或将 script 放在 body 结束标签之前，浏览器会在最后执行 JS 代码，避免阻塞 DOM 构建。


#### 1.2 Style 阶段：样式计算


CSS 引擎处理样式的过程分为三个阶段：

1. 收集、划分和索引所有样式表中存在的样式规则，CSS 引擎会从 style 标签，css 文件及浏览器代理样式中收集所有的样式规则，并为这些规则建立索引，以方便后续的高效查询。
2. 访问每个元素并找到适用于该元素的所有规则，CSS 引擎遍历 DOM 节点，进行选择器匹配，并为匹配的节点执行样式设置。
3. 结合层叠规则和其他信息为节点生成最终的计算样式，这些样式的值可以通过 `window.getComputedStyle()` 获取。


在大型网站中，会存在大量的 CSS 规则，如果为每个节点都保存一份样式值，会导致内存消耗过大。作为替代，CSS 引擎通常会创建共享的样式结构，计算样式对象一般有指针指向相同的共享结构。


附加了计算样式的 DOM 树，一般被称为 CSSOM（CSS Object Model）：


![CSSOM](../assets/166943137-7b97de94-a67e-4a0b-b18a-39d9c2ac8f47-61160b1d45.png)


> 图片来源 [Constructing the Object Model](https://web.dev/critical-rendering-path-constructing-the-object-model/)


CSSOM 和 DOM 是并行构建的，构建 CSSOM 不会阻塞 DOM 的构建。但 CSSOM 会阻塞 JS 的执行，因为 JS 可能会操作样式信息。虽然 CSSOM 不会阻塞 DOM 的构建，但在进入下一阶段之前，必须等待 CSSOM 构建完成。这也是通常所说的 CSSOM 会阻塞渲染。


#### 1.3 Layout 阶段


**创建 LayoutObject（RenderObject） 树**


有了 DOM 树和 DOM 树中元素的计算样式后，浏览器会根据这些信息合并成一个 layout 树，收集所有可见的 DOM 节点，以及每个节点的所有样式信息。


Layout 树和 DOM 树不一定是一一对应的，为了构建 Layout 树，浏览器主要完成了下列工作：

1. 从 DOM 树的根节点开始遍历每个可见节点。
    - 某些不可见节点（例如 script、head、meta 等），它们不会体现在渲染输出中，会被忽略。
    - 某些通过设置 display 为 none 隐藏的节点，在渲染树中也会被忽略。
    - 为伪元素创建 LayoutObject。
    - 为行内元素创建匿名包含块对应的 LayoutObject。
2. 对于每个可见节点，为其找到适配的 CSSOM 规则并应用它们。
3. 产出可见节点，包含其内容和计算的样式。


![Construct Render Tree](../assets/166943302-228415f2-fc37-4436-964b-997bd7b49bdc-2ed47ed74c.png)


> 图片来源 [Render-tree Construction](https://web.dev/critical-rendering-path-render-tree-construction/)


**布局计算**


上一步计算了可见的节点及其样式，接下来需要计算它们在设备视口内的确切位置和大小，这个过程一般被称为自动重排。


浏览器的布局计算工作包含以下内容：

1. 根据 CSS 盒模型及视觉格式化模型，计算每个元素的各种生成盒的大小和位置。
2. 计算块级元素、行内元素、浮动元素、各种定位元素的大小和位置。
3. 计算文字，滚动区域的大小和位置。
4. LayoutObject 有两种类型：
    - 传统的 LayoutObject 节点，会把布局运算的结果重新写回布局树中。
    - LayoutNG（Chrome 76 开始启用） 节点的输出是不可变的，会保存在 NGLayoutResult 中，这是一个树状的结构，相比之前的 LayoutObject，少了很大回溯计算，提高了性能。


#### 1.4 Paint 阶段


Paint 阶段将 LayoutObject 树转换成供合成器使用的高效渲染格式，包括一个包含 display item 列表的 cc::Layers 列表，与该列表与 cc::PropertyTrees 关联。


**构建 PaintLayer（RenderLayer） 树**


构建完成的 LayoutObject 树还不能拿去显示，因为它不包含绘制的顺序（z-index）。同时，也为了考虑一些复杂的情况，如 3D 变换、页面滚动等，浏览器会对上一步的节点进行分层处理。这个处理过程被称为建立层叠上下文。


浏览器会根据 [CSS 层叠上下文规范](https://www.w3.org/TR/CSS21/zindex.html)，建立层叠上下文，常见情况如下：

1. DOM 树的 Document 节点对应的 RenderView 节点。
2. DOM 树中 Document 节点的子节点，也就是 HTML 节点对应的 RenderBlock 节点。
3. 显式指定 CSS 位置的节点（position 为 absolute 或者 fixed）。
4. 具有透明效果的节点。
5. 具有 CSS 3D 属性的节点。
6. 使用 Canvas 元素或者 Video 元素的节点。


浏览器遍历 LayoutObject 树的时候，建立了 PaintLayer 树，LayoutObject 与 PaintLayer 也不一定是一一对应的。每个 LayoutObject 要么与自己的 PaintLayer 关联，要么与拥有 PaintLayer 的第一个祖先的 PaintLayer 关联。


**构建 cc::Layer 与 display items**


浏览器会继续根据 PaintLayer 树创建 cc::Layer 列表。cc::Layer 是列表状结构，每个 layer 包含了个 DisplayItem 列表，每个 DisplayItem 包含了实际的 paint op 指令。将页面分层，可以让一个图层独立于其他的图层进行变换和光栅化处理。

1. 合成更新（Compositing update）
    - 依据 PaintLayer 决定分层（GraphicsLayers）
    - 这个策略被称为 CompositeBeforePaint，未来会被 CompositeAfterPaint 替代。
2. PrePaint
    - PaintInvalidator 进行失效检查，找出需要绘制的 display items。
    - 构建 paint property 树，该树能使动画、页面滚动，clip 等变化仅在合成线程运行，提高性能。
      ![image](../assets/131221558-8d91dfe7-22d6-4fdd-b118-bbb9af117059-f198e1289c.png)
      > 图片来源 [Compositor Property Trees](https://docs.google.com/presentation/d/1V7gCqKR-edNdRDv0bDnJa_uEs6iARAU2h5WhgxHyejQ/edit#slide=id.g1c810b6196_0_58)
3. Paint
    - 遍历 LayoutObject 树并创建 display items 列表。
    - 为共享同样 property tree 状态的 display items 列表创建 paint chunks 分组。
    - 将结果 commit 到 compositor。
    - CompositeAfterPaint 将在此时决定分层。
    - 将 paint chunks 通过 cc::Layer 列表传递给 compositor。
    - 将 property 树转换为 cc::PropertyTrees。


上面的流程中，有两个不同的创建合成层的时机，一个是 paint 之前的 CompositeBeforePaint，该操作在渲染主线程中完成。一个是 paint 之后的 CompositeAfterPaint，后续创建 layer 的操作在 CC（Chromium Compositor）线程中完成。


#### 1.5 合成 Compositing


合成阶段在 CC（Chromium Compositor）线程中进行。


**commit**


当 Paint 阶段完成后，主线程进入 commit 阶段，将 cc::Layer 中的 layer list 和 property 树更新到 CC 线程的 LayerImpl 中，commit 完成。commit 进行的过程中，主线程被阻塞。


**tiling & raster**


raster（光栅化）是将 display item 中的绘制操作转换为位图的过程。


光栅化的主要操作流程如下：

1. tiling：将 layer 分成 tiles（图块）。 因为有的 layer 可能很大（如整个文档的滚动根节点），对整层的光栅化操作代价昂贵，且 layer 中有的部分是不可见的，会造成不必要的浪费。
2. tiles 是光栅化的基本单元。光栅化操作是通过光栅线程池处理的。离视口更近的 tiles 具有更高的优先级，将优先处理。
3. 一个 layer 实际上会生成多种分辨率的 tiles。
4. raster 同样也会处理页面引用的图片资源，display items 中的 paint ops 引用了这些压缩数据，raster 会调用合适的解码器来解压这些数据。
5. raster 会通过 Skia 来进行 OpenGL 调用，光栅化数据。
6. 渲染进程是运行在沙箱中的，不能直接进行系统调用。paint ops 通过 IPC（MOJO）传递给 GPU 进程，GPU 进程会执行真实的 OpenGL（为了保证性能，在 Windows 上转为 DirectX）调用。
7. 光栅化的位图结果保存在 GPU 内存中，通常作为 OpenGL 材质对象保存。
8. 双缓冲机制：主线程随时会有 commit 到来，当前的光栅化行为在 pending tree（LayerImpl）上进行，一旦光栅化操作完成，将 pending tree 变为 active tree，后续的 draw 操作在 active tree 上进行。


**draw**


当所有的 tiles 都完成光栅化后，会生成 draw quads（绘制四边形）。每个 draw quads 是包含一个在屏幕特定位置绘制 tile 的命令，该命令同时考虑了所有应用到 layer tree 的变换。每个四边形引用了内存中 tile 的光栅化输出。四边形被包裹在合成帧对象（compositor frame object）中，然后提交（submit）到浏览器进程。


**display compositor（viz，visual 的简称）**


viz 位于 GPU 进程中，viz 接收来自浏览器的合成帧，合成帧来自多个渲染进程，以及浏览器自身 UI 的 compositor。


合成帧和屏幕上将要绘制的位置关联，该位置叫做 surface。surface 可以嵌套其他 surface，浏览器 UI 的 surface 嵌套了渲染进程的 surface，渲染进程的 surface 嵌套了其他跨域 iframes（同源的 iframe 共享相同的渲染进程） 的 surface。viz 同步传入的帧，并处理嵌套 surfaces 的依赖（surface aggregation）。


最终的显示流程：

1. viz 会发出 OpenGL 调用将合成帧中的 quads 发送到 GPU 线程的 backbuffer 中。
2. 在新的模式中，viz 会使用 Skia 代替原始 OpenGL 调用。
3. 在大部分平台上，viz 的输出也是双缓冲结构，draw 首先到达 backbuffer，通过 swapping 操作转换成 frontbuffer 最终显示在屏幕上。


**线程对浏览器事件的处理**


合成的优点是它在不涉及渲染主线程的情况下完成的。合成器不需要等待样式计算或 JavaScript 执行。只和合成相关的动画被认为是获得流畅性能的最佳选择。同时，合成器还负责处理页面的滚动，滚动的时候，合成器会更新页面的位置，并且更新页面的内容。


当一个没有绑定任何事件的页面发生滚动时，合成器可以独立于渲染主线程之外进行合成帧的的创建，保证页面的流程滚动。当页面中的某一区域绑定了 JS 事件处理程序时，CC 线程会将这一区域标记为 Non-Fast Scrollable Region。如果事件来自于该区域之外，则 CC 线程继续合成新的帧，而无需等待主线程。


在开发中，我们通常会使用事件委托来简化逻辑，但是这会使整个绑定事件的区域变成 Non-Fast Scrollable Region。为了减轻这种情况对滚动造成的影响，你可以传入 `passive: true` 选项到事件监听器中。


```js
document.body.addEventListener(
  "touchstart",
  (event) => {
    if (event.target === area) {
      event.preventDefault();
    }
  },
  { passive: true }
);
```


### 2. 浏览器渲染性能的优化


上一节中是一轮典型的浏览器渲染流程，在流程完成之后，DOM、CSSOM、LayoutObject、PaintLayer 等各种树状数据结构都会保留下来，以便在用户操作、网络请求、JS 执行等事件发生时，重新触发渲染流程。


#### 2.1 减少渲染中的重排重绘


浏览器重新渲染时，可能会从中间的任一步骤开始，直至渲染完成。因此，尽可能的缩短渲染路径，就可以获得更好的渲染性能。
当浏览器重新绘制一帧的时候，一般需要经过布局、绘图和合成三个主要阶段。这三个阶段中，计算布局和绘图比较费时间，而合成需要的时间相对少一些。


以动画为例，如果使用 JS 的定时器来控制动画，可能就需要较多的修改布局和绘图的操作，一般有以下两种方法进行优化：

1. 使用合适的网页分层技术：如使用多层 canvas，将动画背景，运动主体，次要物体分层，这样每一帧需要变化的就只是一个或部分合成层，而不是整个页面。
2. 使用 CSS Transforms 和 Animations：它可以让浏览器仅仅使用合成器来合成所有的层就可以达到动画效果，而不需要重新计算布局，重新绘制图形。[CSS Triggers](https://csstriggers.com/) 中仅触发 Composite 的属性就是最优的选择。


#### 2.2 优化影响渲染的资源


在浏览器解析 HTML 的过程中，CSS 和 JS 都有可能对页面的渲染造成影响。优化方法包括以下几点：

1. 关键 CSS 资源放在头部加载。
2. JS 通常放在页面底部。
3. 为 JS 添加 async 和 defer 属性。
4. body 中尽量不要出现 CSS 和 JS。
5. 为 img 指定宽高，避免图像加载完成后触发重排。
6. 避免使用 table, iframe 等慢元素。原因是 table 会等到它的 dom 树全部生成后再一次性插入页面中；iframe 内资源的下载过程会阻塞父页面静态资源的下载及 css, dom 树的解析。


![script element](../assets/asyncdefer-ba92459a13.svg)


> 图片来源 [The Script Element](https://html.spec.whatwg.org/multipage/scripting.html#the-script-element)


## 参考资料

1. [浏览器的工作原理：新式网络浏览器幕后揭秘](https://www.html5rocks.com/zh/tutorials/internals/howbrowserswork/)
2. [渲染页面：浏览器的工作原理](https://developer.mozilla.org/zh-CN/docs/Web/Performance/How_browsers_work)
3. [Constructing the Object Model](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/constructing-the-object-model)
4. [Inside a super fast CSS engine](https://hacks.mozilla.org/2017/08/inside-a-super-fast-css-engine-quantum-css-aka-stylo/)
5. [Render-tree Construction, Layout, and Paint](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-tree-construction)
6. [Inside look at modern web browser（part 3）](https://developers.google.com/web/updates/2018/09/inside-browser-part3)
7. [Inside look at modern web browser（part 4）](https://developers.google.com/web/updates/2018/09/inside-browser-part4)
8. [DOM](https://chromium.googlesource.com/chromium/src/+/refs/heads/main/third_party/blink/renderer/core/dom/README.md)
9. [CSS](https://chromium.googlesource.com/chromium/src/+/HEAD/third_party/blink/renderer/core/css/style-calculation.md)
10. [Layout](https://chromium.googlesource.com/chromium/src/+/refs/heads/main/third_party/blink/renderer/core/layout/README.md)
11. [Paint](https://chromium.googlesource.com/chromium/src/+/refs/heads/main/third_party/blink/renderer/core/paint/README.md#Overview)
12. [how cc works](https://chromium.googlesource.com/chromium/src/+/refs/heads/main/docs/how_cc_works.md)
13. [Life of a Pixel](https://docs.google.com/presentation/d/1boPxbgNrTU0ddsc144rcXayGA_WF53k96imRH8Mp34Y/edit#slide=id.ga884fe665f_64_6)
