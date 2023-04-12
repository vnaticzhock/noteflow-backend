class Node {
  constructor(nodeId, mediaType, data, tag) {
    Object.defineProperties(this, 'node_id', {
      value: nodeId,
      writable: false,
    });
    this.media_type = mediaType;
    this.data = data;
    this.tag = tag;
  }

  // updateNode() {}
}

export default Node;
