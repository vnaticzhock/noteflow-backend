/* eslint-disable no-await-in-loop */
/* eslint-disable no-lonely-if */
/* eslint-disable import/no-extraneous-dependencies */
import { v4 as uuidv4 } from 'uuid';
import { mongoClient } from '../../sharedb';
import FlowPreview from './FlowPreview';

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

  // 會順便連 flow preview 也一起存起來
  async storeFlow() {
    await mongoClient.connect();
    const database = mongoClient.db('noteflow');
    const collection = database.collection('flows');

    const result = await collection.findOne({
      flowId: this.flowId,
    });
    if (!result) {
      // 新增到資料庫裡面
      await collection.insertOne(...this);
      const flowPrev = new FlowPreview(this.flowId, this.flowName, this.owner);
      flowPrev.storeFlow();
    } else {
      // 需要更新到資料庫中
      if (result !== { ...this }) {
        // 跟現在的結果已經不一樣了
        await collection.updateOne(
          { flowId: this.flowId },
          { $set: { ...this } },
        );
        const flowPrev = new FlowPreview(
          this.flowId,
          result.flowName,
          this.owner,
        );
        flowPrev.storeFlow();
      }
    }
  }

  static async generateFlowId(owner) {
    await mongoClient.connect();
    let resolved = false;
    let newUuid;
    while (!resolved) {
      newUuid = `${owner}-flow-${uuidv4()}`;
      const database = mongoClient.db('noteflow');
      const collection = database.collection('flows');

      const result = await collection.findOne({
        flowId: newUuid,
      });
      if (!result) {
        resolved = true;
      }
    }
    return newUuid;
  }
}

export default Flow;
