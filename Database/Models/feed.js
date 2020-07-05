const mongoose = require("mongoose");
const { Number } = require("mongoose");
const Schema = mongoose.Schema;

const FeedSchema = new Schema(
  {
    authorId: {
      type: String
    },
    title: {
      type: String,
    },
    body: {
      paragraphs: [{
        type: String
      }],
      imageUrl: {
        type: String,
        default: null
      },
      videoUrl: {
        type: String,
        default: null
      }
    },
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    },
    likes: {
      type: Number,
      default: 0
    },
    shareCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);
const FeedModel = mongoose.model("Feed", FeedSchema);

module.exports = FeedModel;
