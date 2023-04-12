import Flow from './Flow.js';

class Flows {
  constructor() {
    this.flows = [];
  }

  push_back(flows) {
    if (Array.isArray(flows)) {
      flows.forEach((element) => {
        if (element instanceof Flow) {
          this.doc.push(element);
        }
      });
      return;
    }

    if (flows instanceof Flow) {
      this.doc.push(flows);
    }
  }
}

export default Flows;
