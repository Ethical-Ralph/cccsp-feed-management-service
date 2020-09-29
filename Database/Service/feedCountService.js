const { sortByDate } = require("../../Utils/helper");
const config = require("../../Config/env");

const uuid = require("uuid").v1;

const FeedsCollection = async (db) => {
  try {
    const feedCollection = db.collection("feedcounts");
    const documentCount = await feedCollection.estimatedDocumentCount();
    return { documentCount, feedCollection };
  } catch (error) {
    throw error;
  }
};

// exports.initializeFeedCounter = async (db) => {
//   try {
//     const { documentCount, feedCollection } = await FeedsCollection(db);
//     if (documentCount === 0) {
//       const feedModelsData = {
//         name: "FeedV1",
//         _id: uuid(),
//         count: 0,
//         dateCreated: new Date(),
//       };
//       await feedCollection.insertOne(feedModelsData);
//       console.log("Feed collection counter initialized");
//       return;
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

const getAllFeedCollection = async (db) => {
  try {
    const feedCollection = db.collection("feedcounts");
    const feedCountCursor = await feedCollection.find({});
    return feedCountCursor.toArray();
  } catch (error) {
    throw error;
  }
};

exports.getAllFeedCollection = getAllFeedCollection;

exports.getPreviousCollection = (allCollection) => {
  try {
    allCollection = sortByDate(allCollection, "dateCreated");
    return allCollection[1];
  } catch (error) {
    throw error;
  }
};

exports.getAvailableCollection = async (db) => {
  try {
    const feedCountsData = await getAllFeedCollection(db);
    return feedCountsData.find((val) => val.count < config.maxFeedInCollection);
  } catch (error) {
    throw error;
  }
};

exports.getLatestFeedCollection = async (db) => {
  try {
    const allCollection = await getAllFeedCollection(db);
    let latestCollection = allCollection[0];

    for (i = 1; i < allCollection.length; i++) {
      if (new Date(latestCollection.date) > new Date(allCollection[i].date)) {
        latestCollection = allCollection[i];
      }
    }
    return latestCollection;
  } catch (error) {
    throw error;
  }
};

exports.createNewCollection = async (db) => {
  try {
    const { documentCount, feedCollection } = await FeedsCollection(db);
    const newFeedCollection = {
      name: `FeedV${documentCount + 1}`,
      _id: uuid(),
      count: 0,
      dateCreated: new Date(),
    };
    await feedCollection.insertOne(newFeedCollection);
    return newFeedCollection;
  } catch (error) {
    throw error;
  }
};

exports.incFeedCollectionCount = async (db, feedCountId) => {
  try {
    await db.collection("feedcounts").updateOne(
      {
        _id: feedCountId,
      },
      {
        $inc: { count: 1 },
      }
    );
  } catch (error) {
    throw error;
  }
};
