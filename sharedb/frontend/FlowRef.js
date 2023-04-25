class NodeRef {
  constructor(
    nodeId,
    position = 0,
    positionAbsolute = 0,
    sourcePosition = 0,
    targetPosition = 0,
    width = 100,
    height = 100,
    style = ""
  ) {
    Object.defineProperties(this, "nodeId", {
      value: nodeId,
      writrable: false,
    });
    // 因為直接寫在 Flow 中，不需要另外 Fetch
    this.position = position;
    this.positionAbsolute = positionAbsolute;
    this.sourcePosition = sourcePosition;
    this.targetPosition = targetPosition;
    this.width = width;
    this.height = height;
    this.style = style;
    // 或者使用解構賦值傳遞值
    // const myInstance = new MyClass(...Object.values(myObject));
  }
}

export default NodeRef;
