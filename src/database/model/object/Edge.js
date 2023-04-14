class Edge {
  constructor(edgeId, type, source, sourceHandle, target, targetHandle, style) {
    Object.defineProperties(this, 'edgeId', {
      value: edgeId,
      writrable: false,
    });
    this.type = type;
    this.source = source;
    this.sourceHandle = sourceHandle;
    this.target = target;
    this.targetHandle = targetHandle;
    this.style = style;
  }

  changeProperty(key, value) {
    if (!(key in Object.keys(this)) || key === 'edgeId') {
      return false;
    }
    Reflect.set(this, key, value);
    return true;
  }
}

export default Edge;
