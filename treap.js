
class Node {
  constructor(key, value, priority) {
    this.priority = priority;
    this.key = key;
    this.value = value;
    this.right = this.left = void 0;
  }
};

class Treap {

  constructor(comparator) {
    this.comparator = void 0;
    this.root = void 0;
    this.count = 0;
    if (!comparator) {
      this.comparator = function(key1, key2) {
        return key1 < key2;
      };
    }
    return this;
  }

  _rand() {
    return Math.random();
  };

  reset() {
    this.root = void 0;
    return this.count = 0;
  };

  get(key) {
    return this._get(this.root, key);
  };

  _get(node, key) {
    if (node == null) {
      return void 0;
    }
    if (this.comparator(key, node.key)) {
      return this._get(node.left, key);
    }
    if (this.comparator(node.key, key)) {
      return this._get(node.right, key);
    }
    return node.value;
  };

  add(key, value) {
    let priority;
    priority = this._rand();
    this.root = this._insert(this.root, key, value, priority);
    return this;
  };

  _insert(node, key, value, priority) {
    if (node == null) {
      this.count++;
      return new Node(key, value, priority);
    }
    if (this.comparator(key, node.key)) {
      node.left = this._insert(node.left, key, value, priority);
      if (node.left.priority < node.priority) {
        return this.leftRotate(node);
      }
      return node;
    }
    if (this.comparator(node.key, key)) {
      node.right = this._insert(node.right, key, value, priority);
      if (node.right.priority < node.priority) {
        return this.rightRotate(node);
      }
      return node;
    }
    node.value = value;
    return node;
  };

  delete(key) {
    if (this.has(key) == null) {
      return;
    }
    return this.root = this._delete(this.root, key);
  };

  _delete(node, key) {
    let result, x;
    if (node == null) {
      throw new Error("key not found");
    }
    if (this.comparator(key, node.key)) {
      result = node;
      x = node.left;
      result.left = this._delete(x, key);
      return result;
    }
    if (this.comparator(node.key, key)) {
      result = node;
      x = node.right;
      result.right = this._delete(x, key);
      return result;
    }
    this.count--;
    return this.merge(node.left, node.right);
  };

  merge(left, right) {
    let result, x;
    if (left == null) {
      return right;
    }
    if (right == null) {
      return left;
    }
    if (left.priority < right.priority) {
      result = left;
      x = left.right;
      result.right = this.merge(x, right);
      return result;
    }
    result = right;
    x = right.left;
    result.left = this.merge(x, left);
    return result;
  };

  split(key) {
    let inserted;
    inserted = this._insert(this.root, key, null, -1);
    return [inserted.left, inserted.right];
  };

  leftRotate(node) {
    let result, x;
    result = node.left;
    x = result.right;
    result.right = node;
    node.left = x;
    return result;
  };

  rightRotate(node) {
    let result, x;
    result = node.right;
    x = result.left;
    result.left = node;
    node.right = x;
    return result;
  };

  has(key) {
    return this._has(this.root, key);
  };

  _has(node, key) {
    if (node == null) {
      return false;
    }
    if (this.comparator(key, node.key)) {
      return this._has(node.left, key);
    }
    if (this.comparator(node.key, key)) {
      return this._has(node.right, key);
    }
    return true;
  };

  height(key) {
    return this._height(this.root, key);
  };

  _height(node, key) {
    let depth;
    if (node == null) {
      return 0;
    }
    if (this.comparator(key, node.key)) {
      depth = this._height(node.left, key);
      return depth + 1;
    }
    if (this.comparator(node.key, key)) {
      depth = this._height(node.right, key);
      return depth + 1;
    }
    return 0;
  };

  length() {
    return this.count;
  };
};

export default Treap;
