# 什么是 TypeScript 泛型


## 相关问题

- TypeScript 泛型的作用是什么


## 回答关键点


`工具` `使用时指定类型`


TypeScript 泛型是一种工具。它能让开发者不在定义时指定类型，而在使用时指定类型。


## 知识点深入


### 1. 泛型类


类型参数在类名后面的尖括号中指定。泛型类可以具有泛型字段或方法。


```ts
class HZFEMember<T, U> {
  private id!: T;
  private name!: U;

  setMember(id: T, name: U): void {
    this.id = id;
    this.name = name;
  }

  show(): void {
    console.log(`ID: ${this.id}, Name: ${this.name}`);
  }
}

const member1 = new HZFEMember<number, string>();
member1.setMember(1, "QingZhen");
member1.show(); // ID: 1, Name: QingZhen

const member2 = new HZFEMember<string, string>();
member2.setMember("02", "Aki");
member2.show(); // ID: 02, Name: Aki
```


### 2. 泛型接口


```ts
interface HZFEMember<T, U> {
  id: T;
  name: U;
}

const member1: HZFEMember<number, string> = {
  id: 1,
  name: "QingZhen",
};
console.log(`ID: ${member1.id}, Name: ${member1.name}`); // ID: 1, Name: QingZhen

const member2: HZFEMember<string, string> = {
  id: "02",
  name: "Aki",
};
console.log(`ID: ${member2.id}, Name: ${member2.name}`); // ID: 02, Name: Aki
```


**函数类型的泛型接口**


```ts
interface ShowHZFEMember<T, U> {
  (id: T, name: U): void;
}

const showHZFEMember: ShowHZFEMember<number, string> = function (id, name) {
  console.log(`ID: ${id}, Name: ${name}`);
};
showHZFEMember(1, "QingZhen"); // ID: 1, Name: QingZhen

const showHZFEMember2: ShowHZFEMember<string, string> = function (id, name) {
  console.log(`ID: ${id}, Name: ${name}`);
};
showHZFEMember2("02", "Aki"); // ID: 02, Name: Aki
```


### 3. 泛型约束


在下面的例子中访问 member 的 id 属性时，因为编译器并不能证明 member 中有 id 属性，所以会报错。


```ts
function getHZFEMember<T>(member: T): T {
  console.log(`ID: ${member.id}`); // Property 'id' does not exist on type 'T'.
  return member;
}
```


如果我们想要限制函数只能处理带有 id 属性的类型，就需要列出对于 T 的约束要求。我们可以定义一个接口来描述约束条件，创建一个包含  id 属性的接口，使用这个接口和 `extends` 关键字来实现约束。


```ts
interface Member {
  id: number;
}

function getHZFEMember<T extends Member>(member: T): T {
  console.log(`ID: ${member.id}`);
  return member;
}

getHZFEMember("QingZhen"); // Argument of type 'string' is not assignable to parameter of type 'Member'.
getHZFEMember({ id: 1, name: "QingZhen" }); // ID: 1
```


### 4. 内置的工具类型


TypeScript 提供了一些内置的工具类型，本质上也是通过范型来实现的。下面，我们通过几种常用的类型来看看它们是怎么实现的。


#### 4.1 Partial<Type>


通过将 Type 中的所有属性都设置为可选来构造一个新的类型。


```ts
interface Member {
  id: number;
  name: string;
  age: number;
}
const hzfer: Member = {
  id: 1,
  name: "Qingzhen",
}; // Property 'age' is missing in type '{ id: number; name: string; }' but required in type 'Member'.

type HZFEMember = Partial<Member>;
const hzfer2: HZFEMember = {
  id: 1,
  name: "Qingzhen",
}; // No errors
```


源码：


```ts
type Partial<T> = {
  [P in keyof T]?: T[P];
};
```


#### 4.2 Required<Type>


通过将 Type 中的所有属性都设置为必选来构造一个新的类型。和 Partial 相反。


```ts
interface Member {
  id: number;
  name: string;
  age?: number;
}
const hzfer: Member = {
  id: 1,
  name: "Qingzhen",
}; // No errors

type HZFEMember = Required<Member>;
const hzfer2: HZFEMember = {
  id: 1,
  name: "Qingzhen",
}; // Property 'age' is missing in type '{ id: number; name: string; }' but required in type 'Required<Member>'
```


源码：


```ts
type Required<T> = {
  [P in keyof T]-?: T[P];
};
```


#### 4.3 Exclude<UnionType, ExcludedMembers>


从联合类型 UnionType 中排除 ExcludedMembers 中的所有联合成员来构造一个新的类型。


```ts
type HZFEMemberProps = Exclude<"id" | "name" | "age", "age">;

const hzferProp: HZFEMemberProps = "age"; // Type '"age"' is not assignable to type 'HZFEMemberProps'.
```


源码：


```ts
type Exclude<T, U> = T extends U ? never : T;
```


#### 4.4 Pick<Type, Keys>


从一个已有的类型 Type 中选择一组属性 Keys 来构造一个新的类型。


```ts
interface Member {
  id: number;
  name: string;
  age: number;
}

type HZFEMember = Pick<Member, "id" | "name">;

const hzfer: HZFEMember = {
  id: 1,
  name: "QingZhen",
  age: 18, // Object literal may only specify known properties, and 'age' does not exist in type 'HZFEMember'.
};
```


源码：


```ts
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```


#### 4.5 Omit<Type, Keys>


从一个已有的类型 Type 中移除一组属性 Keys 来构造一个新的类型。


```ts
interface Member {
  id: number;
  name: string;
  age: number;
}

type HZFEMember = Omit<Member, "id" | "age">;

const hzfer: HZFEMember = {
  id: 1, // Object literal may only specify known properties, and 'id' does not exist in type 'HZFEMember'.
  name: "QingZhen",
};
```


源码：


```ts
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```


#### 4.6 ReturnType<Type>


构造一个由函数的返回值的类型 Type 组成的类型。


```ts
interface GetHZFEMember {
  (id: number): {
    id: number;
    name: string;
    age: number;
  };
}

type HZFEMember = ReturnType<GetHZFEMember>; // type HZFEMember = { id: number; name: string; age: number; };
```


源码：


```ts
type ReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any;
```


#### 4.7 infer


infer 表示在 extends 条件语句中待推断的类型变量。


上文的 ReturnType 源码中的 `infer R` 就代表了待推断的函数的返回值类型。


借助这个能力，我们可以通过 infer 来实现 tuple 转 union：


```ts
// 如果泛型参数 T 满足约束条件 Array<infer I>，那么就返回这个类型变量
type TypeOfArrayItem<T> = T extends Array<infer I> ? I : never;

type MyTuple = [string, number];

type MyUnion = TypeOfArrayItem<MyTuple>; // string | number
```


## 参考资料

1. [Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
