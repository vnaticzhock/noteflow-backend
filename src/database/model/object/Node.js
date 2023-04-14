class Node {
  constructor(nodeId, type, owner, editor) {
    Object.defineProperties(this, 'nodeId', {
      value: nodeId,
      writable: false,
    });
    this.type = type;
    this.owner = owner;
    this.editor = editor;
    this.updateTime = Date.now();
  }

  changeProperty(key, value) {
    if (!(key in Object.keys(this)) || key === 'nodeId') {
      return false;
    }
    Reflect.set(this, key, value);
    return true;
  }
}

export default Node;
