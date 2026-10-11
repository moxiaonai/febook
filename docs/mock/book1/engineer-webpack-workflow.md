# webpack 工作流程


> 本篇内容和配置基于 webpack v5.52.1 讲解


## 相关问题

- webpack 工作流程是怎样的
- webpack 在不同阶段做了什么事情


## 回答关键点


`模块化` `打包` `依赖生成` `工程化`


webpack 是一种模块打包工具，可以将各类型的资源，例如图片、CSS、JS 等，转译组合为 JS 格式的 bundle 文件。


![webpack](../assets/132979267-8ec79dc5-5249-4d2c-9843-7efa909d7320-6c0fe7bf1d.png)


> 图片来源 [webpack 官网](https://webpack.js.org/)


webpack 构建的核心任务是完成内容转化和资源合并。主要包含以下 3 个阶段：

1. 初始化阶段
    - **初始化参数**：从配置文件、配置对象和 Shell 参数中读取并与默认参数进行合并，组合成最终使用的参数。
    - **创建编译对象**：用上一步得到的参数创建 Compiler 对象。
    - **初始化编译环境**：包括注入内置插件、注册各种模块工厂、初始化 RuleSet 集合、加载配置的插件等。
2. 构建阶段
    - **开始编译**：执行 Compiler 对象的 run 方法，创建 Compilation 对象。
    - **确认编译入口**：进入 entryOption 阶段，读取配置的 Entries，递归遍历所有的入口文件，调用 Compilation.addEntry 将入口文件转换为 Dependency 对象。
    - **编译模块（make）**： 调用 normalModule 中的 build 开启构建，从 entry 文件开始，调用 loader 对模块进行转译处理，然后调用 JS 解释器（[acorn](https://www.npmjs.com/package/acorn)）将内容转化为 AST 对象，然后递归分析依赖，依次处理全部文件。
    - **完成模块编译**：在上一步处理好所有模块后，得到模块编译产物和依赖关系图。
3. 生成阶段
    - **输出资源（seal）**：根据入口和模块之间的依赖关系，组装成多个包含多个模块的 Chunk，再把每个 Chunk 转换成一个 Asset 加入到输出列表，这步是可以修改输出内容的最后机会。
    - **写入文件系统（emitAssets）**：确定好输出内容后，根据配置的 output 将内容写入文件系统。


## 知识点深入


### 1. webpack 初始化过程


从 webpack 项目 webpack.js 文件 webpack 方法出发，可以看到初始化过程如下：
![webpack 初始化流程图](../assets/138093156-3b4b60be-4bab-4dcb-970d-c83e4ba1dcf6-1113c1063d.png)

1. 将命令行参数和用户的配置文件进行合并。
2. 调用 getValidateSchema 对配置进行校验。
3. 调用 createCompiler 创建 Compiler 对象。
    1. 将用户配置和默认配置进行合并处理。
    2. 实例化 Compiler。
    3. 实例化 NodeEnvironmentPlugin。
    4. 处理用户配置的 plugins，执行 plugin 的 apply 方法。
    5. 触发 environment 和 afterEnvironment 上注册的事件。
    6. 注册 webpack 内部插件。
    7. 触发 initialize 事件。


```js
// lib/webpack.js 122 行 部分代码省略处理
const create = () => {
  if (!webpackOptionsSchemaCheck(options)) {
    // 校验参数
    getValidateSchema()(webpackOptionsSchema, options);
  }
  // 创建 compiler 对象
  compiler = createCompiler(webpackOptions);
};

// lib/webpack.js 57 行
const createCompiler = (rawOptions) => {
  // 统一合并处理参数
  const options = getNormalizedWebpackOptions(rawOptions);
  applyWebpackOptionsBaseDefaults(options);
  // 实例化 compiler
  const compiler = new Compiler(options.context);
  // 把 options 挂载到对象上
  compiler.options = options;
  // NodeEnvironmentPlugin 是对 fs 模块的封装，用来处理文件输入输出等
  new NodeEnvironmentPlugin({
    infrastructureLogging: options.infrastructureLogging,
  }).apply(compiler);
  // 注册用户配置插件
  if (Array.isArray(options.plugins)) {
    for (const plugin of options.plugins) {
      if (typeof plugin === "function") {
        plugin.call(compiler, compiler);
      } else {
        plugin.apply(compiler);
      }
    }
  }
  applyWebpackOptionsDefaults(options);
  // 触发 environment 和 afterEnvironment 上注册的事件
  compiler.hooks.environment.call();
  compiler.hooks.afterEnvironment.call();
  // 注册 webpack 内置插件
  new WebpackOptionsApply().process(options, compiler);
  compiler.hooks.initialize.call();
  return compiler;
};
```


### 2. webpack 构建阶段做了什么


在 webpack 函数执行完之后，就到主要的构建阶段，首先执行 compiler.run()，然后触发一系列钩子函数，执行 compiler.compile()。
![webpack 执行流程](../assets/134162956-d7210d3a-2881-4d0c-b84b-0a1b813a8d0f-f7b25e5b34.png)

1. 在实例化 compiler 之后，执行 compiler.run()。
2. 执行 newCompilation 函数，调用 createCompilation 初始化 Compilation 对象。
3. 执行 _addEntryItem 将入口文件存入 this.entries（map 对象），遍历 this.entries 对象构建 chunk。
4. 执行 handleModuleCreation，开始创建模块实例。
5. 执行 moduleFactory.create 创建模块。
    1. 执行 factory.hooks.factorize.call 钩子，然后会调用 ExternalModuleFactoryPlugin 中注册的钩子，用于配置外部文件的模块加载方式。
    2. 使用 enhanced-resolve 解析模块和 loader 的真实绝对路径。
    3. 执行 new NormalModule()创建 module 实例。
6. 执行 addModule，存储 module。
7. 执行 buildModule，添加模块到模块队列 buildQueue，开始构建模块, 这里会调用 normalModule 中的 build 开启构建。
    1. 创建 loader 上下文。
    2. 执行 runLoaders，通过 enhanced-resolve 解析得到的模块和 loader 的路径获取函数，执行 loader。
    3. 生成模块的 hash。
8. 所有依赖都解析完毕后，构建阶段结束。


```js
  // 构建过程涉及流程比较复杂，代码会做省略

  // lib/webpack.js 1284行
  // 开启编译流程
  compiler.run((err, stats) => {
    compiler.close(err2 => {
      callback(err || err2, stats);
    });
  });

  // lib/compiler.js 1081行
  // 开启编译流程
  compile(callback) {
    const params = this.newCompilationParams();
    // 创建 Compilation 对象
    const Compilation = this.newCompilation(params);
  }

  // lib/Compilation.js 1865行
  // 确认入口文件
  addEntry() {
    this._addEntryItem();
  }

  // lib/Compilation.js 1834行
  // 开始创建模块流程，创建模块实例
  addModuleTree() {
    this.handleModuleCreation()
  }

  // lib/Compilation.js 1548行
  // 开始创建模块流程，创建模块实例
  handleModuleCreation() {
    this.factorizeModule()
  }

  // lib/Compilation.js 1712行
  // 添加到创建模块队列，执行创建模块
  factorizeModule(options, callback) {
    this.factorizeQueue.add(options, callback);
  }

  // lib/Compilation.js 1834行
  // 保存需要构建模块
  _addModule(module, callback) {
    this.modules.add(module);
  }

  // lib/Compilation.js 1284行
  // 添加模块进模块编译队列，开始编译
  buildModule(module, callback) {
    this.buildQueue.add(module, callback);
  }
```


### 3. webpack 生成阶段做了什么


构建阶段围绕 module 展开，生成阶段则围绕 chunks 展开。经过构建阶段之后，webpack 得到足够的模块内容与模块关系信息，之后通过 Compilation.seal 函数生成最终资源。


#### 3.1 生成产物


执行 Compilation.seal 进行产物的封装。

1. 构建本次编译的 ChunkGraph 对象，执行 buildChunkGraph，这里会将 import()、require.ensure 等方法生成的动态模块添加到 chunks 中。
2. 遍历 Compilation.modules 集合，将 module 按 **entry/动态引入** 的规则分配给不同的 Chunk 对象。
3. 调用 Compilation.emitAssets 方法将 assets 信息记录到 Compilation.assets 对象中。
4. 执行 hooks.optimizeChunkModules 的钩子，这里开始进行代码生成和封装。
    1. 执行一系列钩子函数（reviveModules, moduleId, optimizeChunkIds 等）。
    2. 执行 createModuleHashes 更新模块 hash。
    3. 执行 JavascriptGenerator 生成模块代码，这里会遍历 modules，创建构建任务，循环使用 JavascriptGenerator 构建代码，这时会将 import 等模块引入方式替换为 **webpack_require** 等，并将生成结果存入缓存。
    4. 执行 processRuntimeRequirements，根据生成的内容所使用到的 webpack_require 的函数，添加对应的代码。
    5. 执行 createHash 创建 chunk 的 hash。
    6. 执行 clearAssets 清除 chunk 的 files 和 auxiliary，这里缓存的是生成的 chunk 的文件名，主要是清除上次构建产生的废弃内容。


#### 3.2 文件输出


回到 Compiler 的流程中，执行 onCompiled 回调。

1. 触发 shouldEmit 钩子函数，这里是最后能优化产物的钩子。
2. 遍历 module 集合，根据 entry 配置及引入资源的方式，将 module 分配到不同的 chunk。
3. 遍历 chunk 集合，调用 Compilation.emitAsset 方法标记 chunk 的输出规则，即转化为 assets 集合。
4. 写入本地文件，用的是 webpack 函数执行时初始化的文件流工具。
5. 执行 done 钩子函数，这里会执行 compiler.run() 的回调，再执行 compiler.close()，然后执行持久化存储（前提是使用的 filesystem 缓存模式）。


## 参考资料

1. [webpack5 官方文档](https://webpack.js.org/)
2. [acorn](https://www.npmjs.com/package/acorn)
