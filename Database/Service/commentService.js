const { ObjectId } = require("mongodb");

exports.createComment = async (db, data) => {
  try {
    const comment = await db.collection("comment").insertOne(data);
    return comment;
  } catch (error) {
    throw error;
  }
};

exports.editComment = async (db, data, feedId, commentId) => {
  try {
    await db.collection("comment").updateOne(
      {
        _id: ObjectId(commentId),
        feedId,
      },
      {
        $set: data,
      }
    );

    return;
  } catch (error) {
    throw error;
  }
};

exports.getByFeedId = async (db, feedId) => {
  try {
    const comments = await db.collection("comment").find({
      feedId,
    });
    return comments.toArray();
  } catch (error) {
    throw error;
  }
};

exports.getComment = async (db, commentId, feedId) => {
  try {
    const comment = await db.collection("comment").findOne({
      _id: ObjectId(commentId),
      feedId,
    });
    return comment;
  } catch (error) {
    throw error;
  }
};

exports.deleteComment = async (db, commentId, feedId) => {
  try {
    await db.collection("comment").deleteOne({
      _id: ObjectId(commentId),
      feedId,
    });
    return;
  } catch (error) {
    throw error;
  }
};
