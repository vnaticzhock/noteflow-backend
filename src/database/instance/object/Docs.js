import Doc from './Doc.js';

class Docs {
  constructor() {
    this.doc = [];
  }

  push_back(docs) {
    if (Array.isArray(docs)) {
      docs.forEach((element) => {
        if (element instanceof Doc) {
          this.doc.push(element);
        }
      });
      return;
    }

    if (docs instanceof Doc) {
      this.doc.push(docs);
    }
  }
}

export default Docs;
