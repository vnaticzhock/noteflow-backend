
const getDOc = async (docID) => {
    
      await mongoClient.connect();
    
      const noteflow = mongoClient.db('noteflow');
    
      const result = await noteflow.collection('doc').findOne({
        doc_id: docID,
      });
    
      doc = JSON.stringify(result);
      return doc;
}

export default getDOc;