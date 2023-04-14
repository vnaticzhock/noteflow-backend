class Flow {
  constructor(flowId, flowName, owner, nodes = [], edges = []) {
    // if(content instanceof ...) throw NotContentError...;
    Object.defineProperties(this, 'id', {
      value: flowId,
      writrable: false,
    });
    if (!Array.isArray(nodes) || !Array.isArray(edges)) {
      throw Error('');
    }
    this.flowName = flowName;
    this.owner = owner;
    this.nodes = nodes;
    this.edges = edges;

    if (!this.flowName || !this.flowName === '') {
      this.flowName = 'Untitled';
    }
  }
}

export default Flow;
