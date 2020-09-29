// const fs = require("fs");
const { MongoClient } = require("mongodb");
// const path = require("path");
// const mongoose = require("mongoose");

const connectDatabase = async (uri) => {
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  try {
    await client.connect();

    const db = client.db("myapp");
    console.log("database connected");
    return db;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDatabase;
