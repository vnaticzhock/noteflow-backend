class FlowPreview {
  constructor(flowId, flowName, owner, thumbnail = '') {
    this.flowId = flowId;
    this.flowName = flowName;
    this.owner = owner;
    this.thumbnail = thumbnail;

    if (!this.flowName || this.flowName === '') {
      this.flowName = 'Untitled';
    }
  }
}

export default FlowPreview;
