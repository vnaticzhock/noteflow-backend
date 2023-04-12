class Edge {
  constructor(edgeId, type, source, sourceHandle, target, targetHandle, style) {
    this.edgeId = edgeId;
    this.type = type;
    this.source = source;
    this.sourceHandle = sourceHandle;
    this.target = target;
    this.targetHandle = targetHandle;
    this.style = style;
  }
}

export default Edge;
