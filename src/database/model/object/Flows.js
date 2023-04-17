/* eslint-disable no-await-in-loop */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable object-curly-newline */
/* eslint-disable no-console */
import { v4 as uuidv4 } from 'uuid';
import FlowPreview from './FlowPreview.js';
import { mongoClient } from '../../sharedb.js';
import Flow from './Flow.js';

class Flows {
  constructor(user) {
    if (!/@/.test(user)) {
      throw Error('User needs to be an email.');
    }
    this.flowPreviews = [];
    this.user = user;
  }

  async fetchFlows() {
    await mongoClient.connect();
    const database = mongoClient.db('noteflow');
    const collection = database.collection('flowPreviews');

    const cursor = collection.find(
      {
        owner: this.user,
        // TODO: 新增共編時, shared collaborator 也要加入查找
      },
      {},
    );
    const documents = await cursor.toArray();

    documents.forEach((element, index) => {
      const { flowId, flowName, owner, thumbnail } = element;
      documents[index] = FlowPreview(flowId, flowName, owner, thumbnail);
    });
    this.flowPreviews = documents;

    await mongoClient.close();
  }

  static async fetchFlow(flowId) {
    await mongoClient.connect();
    const database = mongoClient.db('noteflow');
    const collection = database.collection('flows');

    const result = await collection.findOne({
      flowId,
    });
    const { _flowId, flowName, owner, nodes, edges } = result;
    const resolved = new Flow(_flowId, flowName, owner, nodes, edges);

    await mongoClient.close();

    return resolved;
  }

  async addFlow() {
    let flowId;
    let resolved = false;
    while (!resolved) {
      flowId = `${this.user}-flow-${uuidv4()}`;

      await mongoClient.connect();
      const database = mongoClient.db('noteflow');
      const collection = database.collection('flows');

      const result = await collection.findOne({ flowId });
      if (!result) {
        resolved = true;
        const newFlow = new Flow(flowId, '', this.owner);
        await collection.insertOne({ ...newFlow });
      }

      await mongoClient.close();
    }

    await mongoClient.connect();
    const database = mongoClient.db('noteflow');
    const collection = database.collection('flowPreviews');

    const flowPreview = new FlowPreview(flowId, '', this.owner);
    await collection.insertOne({ ...flowPreview });
    this.flowPreviews.push(flowPreview);

    await mongoClient.close();

    return true;
  }
}

export default Flows;
