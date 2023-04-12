class Doc {
  constructor(docId, content) {
    Object.defineProperties(this, 'doc_id', {
      value: docId,
      writrable: false,
    });
    this.content = content;
  }
}

export default Doc;
