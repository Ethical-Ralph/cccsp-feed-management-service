const uuid = require("uuid").v1;

const getCollectionNameById = async (db, documentId) => {
  try {
    const collection = await db.collection("feedcounts").findOne({
      _id: documentId,
    });
    if (!collection) throw Error("Invalid Id");

    return collection;
  } catch (error) {
    throw error;
  }
};

exports.getFeed = async (db, documentId, collectionId) => {
  try {
    const collectionDetails = await getCollectionNameById(db, collectionId);
    const feed = await db.collection(collectionDetails.name).findOne({
      _id: `${documentId}.${collectionId}`,
    });
    return feed;
  } catch (error) {
    throw error;
  }
};

exports.getFeeds = async (db, collection) => {
  try {
    const feeds = await db.collection(collection.name).find({});
    return feeds.toArray();
  } catch (error) {
    throw error;
  }
};

const insertFeed = async (db, data, collection) => {
  try {
    const feed = await db.collection(collection).insertOne(data);
    return feed;
  } catch (error) {
    throw error;
  }
};

exports.createFeed = async (db, feedData, collectionData) => {
  try {
    feedData._id = `${uuid()}.${collectionData._id}`;
    await insertFeed(db, feedData, collectionData.name);
    return feedData;
  } catch (error) {
    throw error;
  }
};

exports.editFeed = async (db, data, documentId, collectionId) => {
  try {
    const collectionDetails = await getCollectionNameById(db, collectionId);

    const feed = await db.collection(collectionDetails.name).updateOne(
      {
        _id: `${documentId}.${collectionId}`,
      },
      { $set: data }
    );
    return feed;
  } catch (error) {
    throw error;
  }
};

exports.likeOrUnlikeFeed = async (
  db,
  shouldLike,
  documentId,
  collectionId,
  userId
) => {
  try {
    const collectionDetails = await getCollectionNameById(db, collectionId);
    await db.collection(collectionDetails.name).updateOne(
      {
        _id: `${documentId}.${collectionId}`,
      },
      shouldLike ? { $push: { likes: userId } } : { $pull: { likes: userId } }
    );
    return;
  } catch (error) {
    throw error;
  }
};

exports.countShare = async (db, documentId, collectionId) => {
  try {
    const collectionDetails = await getCollectionNameById(db, collectionId);

    await db.collection(collectionDetails.name).updateOne(
      {
        _id: `${documentId}.${collectionId}`,
      },
      {
        $inc: { shareCount: 1 },
      }
    );
    return;
  } catch (error) {
    throw error;
  }
};
exports.deleteFeed = async (db, documentId, collectionId) => {
  try {
    const collectionDetails = await getCollectionNameById(db, collectionId);
    const id = `${documentId}.${collectionId}`;
    await db.collection(collectionDetails.name).deleteOne({ _id: id });
    await db.collection("comment").deleteMany({
      feedId: id,
    });
    return;
  } catch (error) {
    throw error;
  }
};
