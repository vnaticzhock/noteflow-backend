/* eslint-disable no-lonely-if */
<<<<<<< HEAD:src/database/model/object/FlowList.js
import { getMongoClient } from '../../sharedb.js';
import shajs from 'sha.js';
=======
import { getMongoClient } from '../../mongoClient.js';
import shajs from 'sha.js'
>>>>>>> mongodb:src/database/mongodb/model/object/FlowList.js

class FlowList {
  constructor(user) {
    this.user = user;
    this.flowList = {};
  }

  static async genFlowListProfile(userEmail) {
    const result = {
      user: userEmail,
      flowList: [],
    };

    const mongoClient = getMongoClient();
    await mongoClient.connect();
    const database = mongoClient.db('noteflow');
    const collection = database.collection('flowList');
    if (await collection.findOne({ user: result.user })) {
      return; // We have created for this user.
    }
    await collection.insertOne(result);

    await mongoClient.close();
  }

  async fetchFlowList() {
    const mongoClient = getMongoClient();
    await mongoClient.connect();
    const database = mongoClient.db('noteflow');
    const collection = database.collection('flowList');

    this.flowList = (
      await collection.findOne({
        user: this.user,
      })
    ).flowList;

    await mongoClient.close();
  }

  async addSomebodyToFlowList(userEmail, flowId) {
    const mongoClient = getMongoClient();
    await mongoClient.connect();
    const database = mongoClient.db('noteflow');
    const collection = database.collection('flowList');
<<<<<<< HEAD:src/database/model/object/FlowList.js
    await collection.findOneAndUpdate(
      {
        user: userEmail,
=======
    await collection.findOneAndUpdate({
      user: userEmail,
    }, {
      $addToSet: { "flowList":
        {owner: userEmail, flowId}
>>>>>>> mongodb:src/database/mongodb/model/object/FlowList.js
      },
      {
        $addToSet: { flowList: { owner: userEmail, flowId } },
      }
    );

    await mongoClient.close();
  }

  async removeSomebodyFromFlowList(userEmail, flowId) {
    const mongoClient = getMongoClient();
    await mongoClient.connect();
    const database = mongoClient.db('noteflow');
    const collection = database.collection('flowList');

    await collection.findOneAndUpdate(
      {
        user: userEmail,
      },
      {
        $pull: { [`flowList.${this.user}`]: flowId },
      }
    );

    await mongoClient.close();
  }
}

export default FlowList;
