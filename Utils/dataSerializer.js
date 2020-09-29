const Joi = require("@hapi/joi");
const { databaseUrl } = require("../Config/env");

exports.serializeFeed = async (feedData) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    paragraphs: Joi.array().optional().default([]),
    imageUrls: Joi.array().optional().default([]),
    videoUrls: Joi.array().optional().default([]),
  });
  const _defaults = {
    likes: [],
    shareCount: 0,
    datePosted: new Date(),
    dateModified: new Date(),
  };
  try {
    let data = await schema.validateAsync(feedData);
    data = Object.assign(data, _defaults);
    return [null, data];
  } catch (error) {
    return [error, null];
  }
};

exports.serializeFeedforUpdate = async (feedData) => {
  const schema = Joi.object({
    title: Joi.string().optional(),
    paragraphs: Joi.array().optional(),
    imageUrls: Joi.array().optional(),
    videoUrls: Joi.array().optional(),
  });
  try {
    const data = await schema.validateAsync(feedData);
    data.dateModified = new Date();
    return [null, data];
  } catch (error) {
    return [error, null];
  }
};

const commentSchema = Joi.object({
  text: Joi.string().required(),
});

exports.serializeComment = async (commentData) => {
  const _defaults = {
    datePosted: new Date(),
    dateModified: new Date(),
  };
  try {
    let data = await commentSchema.validateAsync(commentData);
    data = Object.assign(data, _defaults);
    return [null, data];
  } catch (error) {
    return [error, null];
  }
};

exports.serializeCommentforUpdate = async (newData, prevData) => {
  try {
    const data = await commentSchema.validateAsync(newData);
    data.dateModified = new Date();
    return [null, data];
  } catch (error) {
    return [error, null];
  }
};
