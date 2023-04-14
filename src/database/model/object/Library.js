// import Node from './Node.js';
import { mongoClient } from '../../sharedb.js';
import NodeRepo from './NodeRepo.js';

class Library {
  constructor(userId) {
    Object.defineProperties(this, 'userId', {
      value: userId,
      writrable: false,
    });
    this.nodes = [];
  }

  // addNode() {}
  // deleteNode() {}

  async fetchNodes(query = { user: this.userId }, options = {}) {
    // 不需要 try：有問題 controller 層會 catch
    await mongoClient.connect();
    const database = mongoClient.db('noteflow');
    const collection = database.collection('library');

    // 先拿到 { userId: ..., nodes: ...}
    const result = await collection.findOne(query, options);
    await mongoClient.close();

    const nodeRepo = new NodeRepo(this.userId);
    await nodeRepo.fetchNodes();

    this.nodes = new Array(result.nodes.length);
    result.nodes.forEach((element) => {
      // element.ref
      // element.addTime
      this.nodes.push(nodeRepo.nodes[element.ref]);
    });
  }
}

export default Library;
