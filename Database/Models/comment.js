const mongoose = require("mongoose");
const { Number } = require("mongoose");
const Schema = mongoose.Schema;

const FeedSchema = new Schema({
    authorId: {
        type: String,
    },
    feedId:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Feed"
    },
    body: {
        type: String
    },
},
    { timestamps: true }
);
const FeedModel = mongoose.model("Comment", FeedSchema);

module.exports = FeedModel;
