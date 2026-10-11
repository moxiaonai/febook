# 如何对前端代码实施测试


## 相关问题

- 你是如何看待软件测试的？
- 你在工作中是如何实施测试的？
- 对前端代码进行测试，有哪些测试方法？
- 说说你对测试驱动开发的理解？


## 回答关键点


`Unit Tests` `E2E Tests` `测试覆盖率` `TDD` `BDD`


测试是保障代码质量的重要手段，可以验证我们代码的正确性；测试可以增强我们在修改代码时的信心，保证代码重构的正确性；编写测试还有助于理解业务功能，避免在编写代码时做出过度的设计；对于开发人员来说，测试用例还是最好的开发文档。测试的分类方法有很多种，一般按测试阶段可以分为单元测试（Unit Tests）、集成测试（Integration Tests）、E2E 测试（端到端测试，End-to-End Tests）来保障产品关键路径的可靠性。


一般来说，测试代码由大量的单元测试，适中的集成测试，以及少量的 E2E 测试构成。


测试驱动开发（TDD）是一种通过编写测试来指导软件的开发过程，构建软件的技术。


## 知识点深入


### 测试的种类


从不同的角度对待测试，会有不同的分类方法，例如白盒测试、回归测试、灰度测试、冒烟测试等。以下主要关注测试阶段。按测试的不同目标，在代码中进行以下三种自动化测试：


这三种测试构成测试金字塔，从 E2E 测试到单元测试，集成度越来越低、隔离度越来越高，运行测试所需要的时间也越来越短。
![image](../assets/165334296-ecb4e75d-d166-4735-bf82-c2a96279dbe5-66de7a030a.png)


**单元测试**


是指对软件中独立单元（通常是一个函数、一个模块或一组紧密关联的功能集合）进行测试的方法。单元测试至少应该对模块暴露的公共接口进行测试，同时不应与代码的具体实现耦合得太紧密（如 Element 的 classname）。单元测试中经常会用到被称为 Mocks 或 Stubs 的 fake 实现，这可以使测试免于影响真实的系统，或者让测试运行得更快。


关于测试的 mock，一般有两种不同的意见：一派认为对当前测试点关注之外的东西都可以进行 mock，以实现完美的隔离，来达到避免副作用和进行复杂的测试环境设置的目的；另一派认为要尽量少的在测试中使用 mock，因为 mock 可能与真实的接口存在不一致的地方，而这很难察觉到。在实际的工作中，都会综合考虑这两派的意见，合理谨慎的运用 mock。通常测试覆盖率达到 100% 并不意味着软件就是绝对可靠的。


**集成测试**


一个完整的软件通常需要很多子系统配合工作。比如对后端来说，包含数据库、文件系统及其他网络调用；对前端来说，包含 UI 组件，数据仓库，网络请求等。正如单元测试难以精确界定一个单元的范围一样，集成测试在边界的确定中比单元测试更加模糊。集成测试一般是指对系统和外部功能的集成整体进行的测试。


另一方面，集成测试的含义通常比单元测试更模糊，如何确定测试的边界往往随着项目的具体情况而各有不同。集成测试中通常有着和单元测试重复的部分。有一种观点是认为可以用契约测试（Contract Tests）代替部分集成测试。


在现代化的组织架构中，随着软件的规模越来越大，开发部门也会分成各个规模较小的团队，各自负责相对独立的部分，构建高内聚、低耦合的服务。不同的服务之间通常是通过接口互相通信的，比如通过 HTTP 进行 REST 通信，使用 gRPC 来进行 RPC 通信，或者使用消息队列来进行通信。这时，可以考虑使用契约测试，来对各个子系统提供的接口进行测试。


**E2E 测试**


测试金字塔的最顶端一般是 E2E 测试，在进行测试时，一般有测试人员手动进行的测试，也有自动化的工具进行的测试。


E2E 测试中的一条用例会覆盖一条完整的用户操作流程。对于 web 程序来说，我们会测试用户的输入是否触发了正确的动作、数据是否呈现给了用户、UI 状态是否按照预期改变等等。


Web 应用程序的 E2E 测试通常是使用 WebDriver 来驱动实际的浏览器运行来进行测试的，这通常意味着 E2E 测试会很慢。所以我们在功能点能够被前面两种测试覆盖的时候，尽量采用它们来进行测试。


### 如何编写测试


最理想的状态是践行测试驱动开发，采用先红后绿的流程开发软件。这比写完功能代码后再补充测试要好，因为后补测试用例是在功能代码已经完成的情况下进行的，这也就是所谓的白盒测试。


白盒测试可能面临某些思维盲点（例如一旦从一堆不规则的图形中找出了五角星，后面再次看到时就很难再忽略它了），可能会导致测试覆盖的不够全面。白盒测试也可能过多的测试边缘情况，而忽略了业务主流程。
![image](../assets/164974483-2a382312-1b02-4336-87fa-02c7d6679542-eed568c299.png)


> 图片来源 [像用户一样测试：打破知识诅咒](https://insights.thoughtworks.cn/test-like-user-1/)


TDD 有四个关键点：

1. 思考（Think）：对业务需求进行拆解，将需求分解为有上下文、行为和预期结果的一个或多个任务列表，并保证列表中的每个任务是简单的、能快速实现的。
2. 红（Red bar）：从上一步的任务列表中挑选任务，为该任务快速的编写测试代码，然后不断循环的完成所有任务到测试用例的转换。此时，运行测试代码时的断言是会失败的。
3. 绿（Green bar）：以最快的速度让测试变绿，这通常意味着不需要考虑复杂的设计模式，不做过度设计，不写多余的代码，只需要符合一些简单的设计原则就行了。
4. 重构（Refactor）：在上面所有的测试都通过以后，现在可以对代码开始重构（识别代码中的坏味道（Code smell）、应用更健壮的设计模式等），而不必担心破坏之前的功能。
5. 当准备好添加新的功能时，重新开始上面的循环。不断添加小的增量是实践 TDD 的关键。


#### 测试的结构


对于所有的测试代码，一般都会遵循以下的结构。

1. 设置测试数据。
2. 调用测试方法。
3. 断言期望的结果已经返回。


这个结构通常被记为 "Arrange, Act, Assert" 的 3A 短语。另外有一个来自 BDD（行为驱动开发）的一组短语是 "Given, When, Then"。


#### 测试工具


**单元测试工具**


测试框架：常用的测试框架有 Jest，Mocha，Jasmine，AVA 等，大部分测试框架都提供了类似的功能，一般包括以下这些方面：

- 测试块的组织，比如 describe 和 it/test 语法。
- 每个 describe 块的 before[All]，after[All]，beforeEach，afterEach 钩子。
- 全局的 setup 和 teardown 设置。
- 匹配语法，各个框架一般拥有相似的接口，而这个风格一般继承自 Chai 这个框架。
- Mock 功能的支持，对定时器的 mock、对函数的 mock、对模块的 mock。


被 Chai 发扬光大的三种匹配语法：


```js
// Assert 经典语法，提供了对被测试对象的各个维度的断言语法。
assert.typeOf(foo, "string");
assert.equal(foo, "bar");
assert.lengthOf(foo, 3);
assert.property(tea, "flavors");
assert.lengthOf(tea.flavors, 3);

// 下面两种都是 BDD 风格的断言方式，它们都使用了更接近自然表达的语法来进行匹配。
// 在 node.js 和现代浏览器中，它们几乎没有区别。
// Should 采用了修改 Object 原型的方式实现到链式语法，这可能在古老的 IE 浏览器或某些嵌入式 JS 运行时中不能正常工作。

// Expect
expect(foo).to.be.a("string");
expect(foo).to.equal("bar");
expect(foo).to.have.lengthOf(3);
expect(tea).to.have.property("flavors").with.lengthOf(3);

// Should
foo.should.be.a("string");
foo.should.equal("bar");
foo.should.have.lengthOf(3);
tea.should.have.property("flavors").with.lengthOf(3);
```


其他拥有的测试工具：

- 针对具体 UI 框架的测试插件，如针对 React 的 `@testing-library/react`，`enzyme`，`react-test-renderer` 等。
- 模拟 DOM 环境的 `jsdom`。
- 践行 BDD 的代表 `Cucumber.js`。
- 收集测试覆盖率的辅助工具 `istanbul`，或使用 v8 引擎内置的覆盖率功能的 `c8`。


测试覆盖率收集原理：


`istanbul.js` 提供了名为 `nyc` 的工具，执行 `nyc instrument <input> <output>` 即可完成对代码的插桩。在代码实际运行时，插桩代码会统计源代码各部分的运行次数，来统计覆盖率。


例子：


```js
function greeting(name = "HZFE") {
  if (DEBUG) {
    name = `${name} (DEBUG)`;
  }

  const foo = DEBUG ? "(DEBUG) foo" : "foo";

  for (const i = 0; i < name.length; i++) {
    name += "!";
  }

  return `Hello ${name}`;
}
```


经过 `nyc instrument` 后，大致代码如下：


```js
function cov_g4lly5ec() {
  // ...
  var coverageData = {
    path: "...",
    statementMap: {
      0: { start: { line: 2, column: 2 }, end: { line: 4, column: 3 } },
      // ...
    },
    fnMap: {
      0: {
        name: "greeting",
        decl: { start: { line: 1, column: 9 }, end: { line: 1, column: 17 } },
        loc: { start: { line: 1, column: 33 }, end: { line: 13, column: 1 } },
        line: 1,
      },
    },
    branchMap: {
      0: {
        loc: { start: { line: 1, column: 18 }, end: { line: 1, column: 31 } },
        type: "default-arg",
        locations: [
          { start: { line: 1, column: 25 }, end: { line: 1, column: 31 } },
        ],
        line: 1,
      },
      // ...
    },
    s: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
    f: { 0: 0 },
    b: { 0: [0], 1: [0, 0], 2: [0, 0] },
    // ...
  };
  // ...
  return actualCoverage;
}
cov_g4lly5ec();
function greeting(name = (cov_g4lly5ec().b[0][0]++, "HZFE")) {
  cov_g4lly5ec().f[0]++;
  cov_g4lly5ec().s[0]++;
  if (DEBUG) {
    cov_g4lly5ec().b[1][0]++;
    cov_g4lly5ec().s[1]++;
    name = `${name} (DEBUG)`;
  } else {
    cov_g4lly5ec().b[1][1]++;
  }
  const foo =
    (cov_g4lly5ec().s[2]++,
    DEBUG
      ? (cov_g4lly5ec().b[2][0]++, "(DEBUG) foo")
      : (cov_g4lly5ec().b[2][1]++, "foo"));
  cov_g4lly5ec().s[3]++;
  for (const i = (cov_g4lly5ec().s[4]++, 0); i < name.length; i++) {
    cov_g4lly5ec().s[5]++;
    name += "!";
  }
  cov_g4lly5ec().s[6]++;
  return `Hello ${name}`;
}
```


istanbul 在解析源代码时，会在函数体、默认参数、分支语句等各处位置插入记录执行次数的代码，在三元运算符等特殊位置会利用 JS 逗号运算符的特性插入统计代码。


例，在`cov_g4lly5ec().b[1][0]++;` 之中的 b 代表 branch（分支），1 代表第一个分支语句，1 后面紧跟的 0 代表分支的第一个叉路。依此类推，这些代码记录了 f(function)，s(statement)，b(branch) 的执行次数。后面的索引最终会解析到 `statementMap`，`fnMap`，`branchMap` 中的对应项，映射到源代码中的具体位置。这样在执行完测试用例中，就能够知道源代码中每一处语法结构被运行的情况。


**E2E 测试**


常见工具有 Pupeteer、Nightwatch、TestCafe、Selenium、Cypress、Playwright 等。它们都是通过控制浏览器执行代码来模拟实际用户的操作，来验证 UI 的变化符合预期。E2E 测试的目的是为了尽量测试软件在真实环境下的表现，一般很少使用 mock。
基于测试在真实的浏览器下运行，和测试环境网络不稳定两个主要因素，E2E 测试通常要执行很长的时间，并且会较频繁的面临失败。在实际的持续集成环境中，一般会让 E2E 测试重试 2 到 3 次来尽可能的排除环境因素导致的失败。


在这些常用的工具中，目前使用比较广泛的三个是 Pupeteer，Cypress，Playwright。它们三个有比较突出的特点：

- Pupeteer：Google 官方提供的测试工具，使用 Chrome DevTools Protocol 与 Chromium 系列的浏览器进行交互。所提供的 API 是比较底层的基本操作，通常需要自己封装常用的操作，但在具体的使用中相对灵活，限制较少。
- Cypress: 高度集成的测试工具，自动等待异步操作，降低编码门槛。提供 Test Runner 可视化运行测试，记录测试步骤中的具体细节，可以查看测试代码中每一步所对应的 DOM 快照，便于 debug。基于 iframe 运行，测试代码和被测试应用处于同一运行环境，可以提高测试的可靠性。目前的限制是不支持多窗口，以及 iframe 在安全策略上的小部分无法规避的限制。
- Playwright：微软开发的测试工具，支持除 Chromium 之外的 Firefox 和 Safari，拥有 Trace View 可以提供类似 Cypress 的强大 debug 体验。支持除了 JS/TS 以外的语言如 Python、.NET、Java，适用范围更广。


**集成测试**


一般情况下，集成测试所需使用的工具都涵盖在单元测试和 E2E 测试使用的工具之中了。


### 进行测试的最佳实践

1. 测试应该足够快。只有测试能够快速运行得到反馈，测试人员才会乐意采用 TDD 的方式进行开发。反例是 E2E 测试，通常开发人员不会想要在本地频繁的运行 E2E 测试，因为这会浪费他们很多时间。使测试运行足够快，合理的配置测试框架，只运行改动相关的测试。
2. 测试应该足够简单。如果测试代码写的非常复杂，也许会有疑问：“如何保证测试代码是正确的呢？”，那就可能需要对测试代码进行测试，所以在测试代码中，应该保证使用简单的代码，不要使用复杂、抽象度高的代码。对于确实需要使用复杂工具的场景，可以尝试使用久经考验的工具库。或者自己抽象一部分测试辅助工具代码，并对其进行测试。
3. 测试应该具备良好的可读性。和上一条类似，保持简单的同时，也要保证良好的可读性。良好的可读性可以避免开发人员误解测试用例的意图，并可以最大限度发挥测试用例作为最佳文档的功能。虽然可读性是比较主观的感受，但也可以通过遵循下面的规则进行一定程度上的量化。
    - 使用 "Arrange, Act, Assert" 或 "Given, When, Then" 来组织测试代码。
    - 每个测试块中专注于一项功能的测试，不要将太多断言混合在一起。
    - 避免使用魔术数字和字符串，使用含义更清晰的常量取代。
4. 测试代码中不要重复实现源代码中的逻辑。例如，用于与实际代码返回的 Received 对比的 Expected 应该是一个简单的列举出来的字面量，而不是通过和源代码类似的逻辑动态生成的结果。
5. 测试必须是稳定的。测试用例的成功或失败只取决于被测试的代码，测试用例不因其他用例、环境因素、外部依赖的变化而改变结果。
6. 不要将测试与实现细节耦合。提高测试用例稳定性，避免因为代码中微小的改动而导致测试用例失败。如，使用 contain 代替 equal 检查内容；使用 getByRole 代替 querySelector。


## 参考资料

- [The Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)
- [TDD](http://www.jamesshore.com/v2/books/aoad1/test_driven_development)
- [V8 Coverage](https://v8.dev/blog/javascript-code-coverage)
- [istanbul](https://istanbul.js.org/docs/advanced/instrument/)
- [Assertion Styles](https://www.chaijs.com/guide/styles/)
- [Jest](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
