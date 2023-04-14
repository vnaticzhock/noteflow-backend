/* eslint-disable no-console */
import { mongoClient } from '../../sharedb.js';
import Node from './Node.js';

class NodeRepo {
  constructor(user) {
    if (!/@/.test(user)) {
      throw Error('User needs to be an email.');
    }
    this.user = user;
    this.nodes = {};
  }

  async fetchNodes(query = { user: this.user }, options = {}) {
    // 不需要 try：有問題 controller 層會 catch
    await mongoClient.connect();
    const database = mongoClient.db('noteflow');
    const collection = database.collection('nodeRepository');

    const cursor = collection.find(query, options);
    const documents = await cursor.toArray();

    await mongoClient.close();

    documents.forEach((element) => {
      this.nodes[element.nodeId] = element;
    });
  }

  async addNode(node) {
    /**
     * journey:
     *  1. In flow: create new node
     *  2. Get permission from here
     *  3. Produce a ref to the flow
     */
    if (!(node instanceof Node)) {
      throw Error('It is not a Node');
    }

    await mongoClient.connect();
    const database = mongoClient.db('noteflow');
    const collection = database.collection('nodeRepository');

    collection.insertOne({
      ...node,
    });

    await mongoClient.close();

    this.nodes.push(node);
    return true;
  }
}

export default NodeRepo;
