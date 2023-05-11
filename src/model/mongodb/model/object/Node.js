import sharedb from '../../sharedb.js';
import { getMongoClient } from '../../mongoClient.js';

class Node {
    constructor(id, type, owner, colaborators) {
        this.id = id;
        this.name = 'Untitled';
        this.type = type;
        this.owner = owner;
        this.colaborators = Array.isArray(colaborators)
            ? colaborators
            : [this.owner];
        this.updateTime = Date.now();
    }

    validate() {
        return !this.id || !this.type || !this.owner || !this.colaborators;
    }

    addEditor() {
        const connection = sharedb.connect();
        const doc = connection.get('editor', this.id);
        doc.fetch((err) => {
            if (err) throw err;
            if (doc.type === null) {
                doc.create([{ insert: '' }], 'rich-text');
            }
            console.log('node added!', doc.data);
        });
    }

    static async CanUserEdit(nodeId, owner, target) {
        const mongoClient = getMongoClient();
        await mongoClient.connect();
        const database = mongoClient.db('noteflow');
        const collection = database.collection('nodeRepository');

        const resolved = await collection
            .aggregate([
                { $match: { user: owner } },
                { $limit: 1 },
                { $unwind: '$nodes' },
                { $match: { 'nodes.id': nodeId } },
            ])
            .toArray();

        await mongoClient.close();
        return resolved[0].nodes.colaborators.includes(target);
    }

    async editTitle(newTitle) {
        const mongoClient = getMongoClient();
        await mongoClient.connect();
        const database = mongoClient.db('noteflow');
        const collection = database.collection('nodeRepo');

        const result = await collection.findOne({
            user: this.user,
            nodes: { $elemMatch: { nodeId: newUuid } },
        });
        if (!result) {
            resolved = true;
        }
        await mongoClient.close();
    }
}

export default Node;
