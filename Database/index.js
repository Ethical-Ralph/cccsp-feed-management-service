// const fs = require("fs");
const { MongoClient } = require("mongodb");
// const path = require("path");
// const mongoose = require("mongoose");

let db;

const database = {
  async connect(uri) {
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try {
      await client.connect();
      db = client.db();
      console.log("database connected");
      return db;
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  },
  async drop() {
    await db.dropDatabase();
    return;
  },
};

module.exports = database;
