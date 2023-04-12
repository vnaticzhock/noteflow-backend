class NodeRef {
  constructor(
    nodeId,
    position,
    positionAbsolute,
    sourcePosition,
    targetPosition,
    width,
    height,
    style,
  ) {
    this.nodeId = nodeId;
    this.position = position;
    this.positionAbsolute = positionAbsolute;
    this.sourcePosition = sourcePosition;
    this.targetPosition = targetPosition;
    this.width = width;
    this.height = height;
    this.style = style;
    // 或者使用解構賦值傳遞值
    // const myInstance = new MyClass(...Object.values(myObject));
    // this.node = new Node()
  }

  changeProperty(key, value) {
    if (!(key in Object.keys(this))) {
      return false;
      // throw Error('...');
    }
    Reflect.set(this, key, value);
    return true;
  }
}

export default NodeRef;
