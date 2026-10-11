# 平衡二叉树


## 题目描述


输入一棵二叉树的根节点，判断该树是不是平衡二叉树。如果某二叉树中任意节点的左右子树的深度相差不超过 1，那么它就是一棵平衡二叉树。


示例 1:


```text
给定二叉树 [3, 9, 20, null, null, 15, 7]

    3
   / \
  9  20
    /  \
   15   7
返回 true。
```


示例 2:


```text
给定二叉树 [1,2,2,3,3,null,null,4,4]

       1
      / \
     2   2
    / \
   3   3
  / \
 4   4
返回 false。
```


限制：0 <= 树的结点个数 <= 10000


## 基本知识点


二叉树的每个节点最多有两个子节点，平衡二叉树中任意一个节点的左右子树高度相差不能大于 1，满二叉树和完全二叉树都是平衡二叉树，普通二叉树有可能是平衡二叉树。


## 题解


### 解法一


#### 思路


若想判断二叉树是不是平衡二叉树，只需要判断左右子树的高度差是不是不超过 1 即可。同时，要满足一个树是平衡二叉树，它的子树也必须是平衡二叉树。我们可以从根结点开始，通过递归来求得子树的高度，以及子树是否是平衡二叉树，以此来结合判断二叉树是否是平衡二叉树。


#### 代码


```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val === undefined ? 0 : val)
 *     this.left = (left === undefined ? null : left)
 *     this.right = (right === undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
const isBalanced = function (root) {
  if (root === null) {
    return true;
  } else {
    return (
      Math.abs(height(root.left) - height(root.right)) <= 1 &&
      isBalanced(root.left) &&
      isBalanced(root.right)
    );
  }
};

const height = function (root) {
  if (root === null) {
    return 0;
  } else {
    return Math.max(height(root.left), height(root.right)) + 1;
  }
};
```


#### 时间复杂度分析


该方法最坏的情况是每个父节点都只有一个子节点，这样树的高度时间复杂度为 O(n)，即“链表”的长度。而第 d 层调用 `height` 函数的时间复杂度是 O(d)，所以整体的时间复杂度为高度时间复杂度 * 调用 `height` 函数的时间复杂度，即 O(n^2)。


#### 空间复杂度分析


空间复杂度取决于递归调用的层数，不会超过 n 层，所以空间复杂度是 O(n)。


### 解法二


#### 思路


上面的方法是自顶而下的，这样其实就会导致每层的高度都要重复计算。那么，我们可以使用后序遍历，这样每个节点的高度就能根据前面的结果算出来。


#### 代码


```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val === undefined ? 0 : val)
 *     this.left = (left === undefined ? null : left)
 *     this.right = (right === undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isBalanced = function (root) {
  return height(root) != -1;
};

var height = function (root) {
  if (root == null) {
    return 0;
  }

  const left = height(root.left);
  const right = height(root.right);

  if (left === -1 || right === -1 || Math.abs(left - right) > 1) {
    return -1;
  }

  return Math.max(left, right) + 1;
};
```


#### 时间复杂度分析


由于是后序遍历，每个节点只会被调用 1 次，所以，该方法的时间复杂度是 O(n)。


#### 空间复杂度分析


空间复杂度取决于递归调用的层数，不会超过 n 层，所以空间复杂度是 O(n)。
