/* eslint-disable no-lonely-if */
import { mongoClient } from '../../sharedb';

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

  async storeFlow() {
    await mongoClient.connect();
    const database = mongoClient.db('noteflow');
    const collection = database.collection('flowPreviews');

    const result = await collection.findOne({
      flowId: this.flowId,
    });
    if (!result) {
      // 新增到資料庫裡面
      await this.newThumbNail();
      await collection.insertOne(...this);
    } else {
      // 需要更新到資料庫中
      if (result !== { ...this }) {
        // 跟現在的結果已經不一樣了
        await collection.updateOne(
          { flowId: this.flowId },
          { $set: { ...this } },
        );
      }
    }
  }

  async newThumbNail() {
    // TODO: create a link to s3
    this.thumbnail = '';
  }
}

export default FlowPreview;
