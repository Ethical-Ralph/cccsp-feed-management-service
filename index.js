const express = require("express");
const cors = require("cors");
const Database = require("./Database");
const config = require("./Config/env");
const { errorHandler } = require("./Utils/error");
const routes = require("./Routes");
const morgan = require("morgan");

const getDatabaseUri = () => {
  const nodeEnv = config.nodeEnv;
  const { prod, dev, test } = config.databaseUrl;
  switch (nodeEnv) {
    case "production":
      return prod;
    case "dev":
      return dev;
    case "test":
      return test;
    default:
      return prod;
  }
};
const app = express();

app.disable("x-powered-by");

app.use(cors());

app.use(morgan("dev"));

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

const startServer = async () => {
  const databaseUri = getDatabaseUri();
  console.log(databaseUri);
  const db = await Database.connect(databaseUri);

  app.use("/v1/feed/", routes(db));

  errorHandler(app);

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
  });
};

startServer().catch(console.log);
module.exports = app;
