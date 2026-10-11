# TypeScript 中的 Interface 和 Type Alias


## 相关问题

- Interface 和 Type Alias 的作用
- Interface 和 Type Alias 的相同点
- Interface 和 Type Alias 的区别


## 回答关键点


`类型约束` `扩展` `类型合并`


Interface 和 Type Alias（Type 别名，下文简称 Type）是 TypeScript 中两个非常重要且常用的概念。在程序设计中，Interface 和 Type 主要起到类型的限制和规范的作用，它们不关心实现细节，只规定和限制类或变量必须提供对应的属性和方法。


Interface 和 Type 核心的区别是 Type 不可在定义后重新添加内容，而 Interface 则总是可以扩展新内容。相比 Interface，Type 并没有实际创建一个新的类型，而是创建一个引用某个类型的名字。


## 知识点深入


总体来说，Interface 和 Type 两者非常相似，Interface 的特性大部分都可以使用 Type 实现，在大多数场景下都可以任意选择 Interface 或 Type 实现功能。根据这两者设计上的异同，可以总结出两者使用上的相同点和不同点。


### 1. Interface 和 Type 的相同点


#### 1.1 可描述对象/函数


Interface 和 Type 都可以描述对象和函数。


```ts
// Interface
interface IHzfe {
  name: string;
}
interface GetHZFE {
  (): string;
}

// Type
type THzfe = {
  name: string;
};
type GetHZFE = () => string;
```


#### 1.2 可扩展


Interface 和 Type 都可以扩展类型。


```ts
// Interface
interface IHzfe {
  name: string;
}
interface IShfe extends IHzfe {
  location: string;
}

// Type
type THzfe = {
  name: string;
};
type TShfe = THzfe & { location: string };
```


另外，Interface 的 extends 和 Type 的交叉类型有一些细微区别：extends 中的同名字段的类型必须是兼容的。而交叉类型中出现了同名字段且类型不同时，则类型一般是 never。


#### 1.3 class Implements


Interface 和 Type 描述的类型都可以被 class 实现。


```ts
// Interface
interface IHzfe {
  name: string;
}

// Type
type THzfe = {
  name: string;
};

class HZFE1 implements IHzfe {
  name = "HZFEStudio";
}
class HZFE2 implements THzfe {
  name = "HZFEStudio";
}
```


### 2. Interface 和 Type 的不同点


#### 2.1 基本类型别名、联合类型、元组


由于 Type 定义的实际是一个别名，所以 Type 可以描述一些基本类型、联合类型和元组的别名。


```ts
// 基本类型
type HZFEMember = number;

// 联合类型
type HZFEMemberTechStack = string | string[];

// 元组
type HZFEMember = [number, string];
```


#### 2.2 声明合并


Interface 可以重复定义，并将合并所有声明的属性为单个接口。而 Type 不可重复定义。


```ts
// Interface
interface IHzfe {
  name: string;
}
interface IHzfe {
  member: number;
}

const hzfe: IHzfe = { name: "HZFE", member: 17 };
```


#### 2.3 动态属性


Type 可以使用 in 关键字动态生成属性，而 Interface 的索引值必须是 string 或 number 类型，所以 Interface 并不支持动态生成属性。


```ts
type HZFELanguage = "JavaScript" | "Go";
type HZFEProjects = {
  [key in HZFELanguage]?: string[];
};

const hzfeProjects: HZFEProjects = {
  JavaScript: ["xx", "xx"],
};
```


## 参考资料

1. [TypScript - Typed JavaScript at Any Scale](https://www.typescriptlang.org/)
