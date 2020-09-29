const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDatabase = require("./Database");
const config = require("./Config/env");
const { errorHandler } = require("./Utils/error");
const routes = require("./Routes");
const morgan = require("morgan");
const {
  initializeFeedCounter,
} = require("./Database/Service/feedCountService");

dotenv.config();
const isProd = process.env.NODE_ENV === "production";
const databaseUri = isProd ? config.databaseUrl.prod : config.databaseUrl.dev;
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
  const db = await connectDatabase(databaseUri);
  await initializeFeedCounter(db);

  app.use("/feed/", routes(db));

  errorHandler(app);

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
  });
};

startServer();
module.exports = app;
