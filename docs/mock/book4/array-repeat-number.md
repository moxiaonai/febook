# 找到数组中重复的数字


## 题目描述


找出数组中重复的数字。


在一个长度为 n 的数组 nums 里的所有数字都在 0 ~ n-1 的范围内。数组中某些数字是重复的，但不知道有几个数字重复了，也不知道每个数字重复了几次。请找出数组中任意一个重复的数字。


示例：


```text
输入：[2, 3, 1, 0, 2, 5, 3]
输出：2 或 3
```


## 解法一： 哈希表


[在线链接](https://codesandbox.io/s/hzfe-suan-fa-shu-zu-zhong-chong-fu-shu-zi-ha-xi-biao-forked-p8df3?file=/index.html)


从题目中分析，只需要找到任意一个重复的数字，那么可以利用哈希表，用数字的值作为 key 去存储，如果遇到已经存在的 key，则直接返回，这样就找到了重复的数字。


### 算法步骤

1. 声明哈希表用来保存遍历的值。
2. 开始遍历数组。
3. 获取当前值，判断值是否已经存在，若存在，则返回结果并结束循环；若不存在，则继续下一步。
4. 储存当前值进哈希表。
5. 处理数组下一位，重复直到遍历完成。


```js
/**
 * @param {number[]} nums
 * @return {number}
 */
const findRepeatNumber = function (nums) {
  // 定义 hash 表
  let map = new Map();
  let i = 0;
  while (i < nums.length) {
    // 如果存在当前数字，那么直接结束循环，返回当前数字
    if (map.has(nums[i])) {
      return map.get(nums[i]);
    }
    // 储存已经遍历过的值
    map.set(nums[i], nums[i]);
    i++;
  }
};
```


### 复杂度分析

- 时间复杂度 O(N)：遍历一遍数组既可完成。
- 空间复杂度 O(N)：需要声明哈希表进行存储。


## 解法二： 原地交换


[在线链接](https://codesandbox.io/s/hzfe-suan-fa-shu-zu-zhong-chong-fu-shu-zi-yuan-di-jiao-huan-forked-bxsby?file=/index.html)


我们可以把数组的值，交换到与该值相等的索引的位置。如果交换时发现，该索引的位置已经存在与当前值相等的值，则结束操作并返回当前值。


### 算法步骤

1. 遍历数组。
2. 判断当前值和索引是否相等，如果是，直接跳过处理下一个元素，不是，则进行下一步。
3. 判断需要交换的索引位置的值，是否和当前值相等，如果是，则返回当前值并结束，不是，则进行下一步。
4. 将当前值和对应索引位置的元素进行交换。
5. 依次处理完全部元素。


```js
/**
 * @param {number[]} nums
 * @return {number}
 */
const findRepeatNumber = function (nums) {
  let i = 0;
  while (i < nums.length) {
    // 如果当前值等于索引，那么直接跳过
    if (nums[i] === i) {
      i++;
      continue;
    }
    // 如果需要交换的索引位置已经存在相同值，直接结束，返回当前值
    if (nums[nums[i]] === nums[i]) {
      return nums[i];
    }
    // 交换当前值，和对应索引存在的值
    [nums[nums[i]], nums[i]] = [nums[i], nums[nums[i]]];
  }
  return -1;
};
```


### 复杂度分析

- 时间复杂度 O(N)：每个元素最多被移动 2 次。
- 空间复杂度 O(1)：不需要额外的空间完成。


## 参考资料

1. [剑指 offer](https://book.douban.com/subject/6966465/)
