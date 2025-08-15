// require("dotenv").config();
const express = require("express");
// const propertyRouter = require("./Routes/propertyRoutes");
// const userRouter = require("./Routes/userRoutes");
const cityRouter = require("./Routes/cityRoutes");
const mysqlConnector = require("./utilities/mysqlConnector");
const bodyParser = require("body-parser");
const app = express();
mysqlConnector.check();
// mysqlConnector.check();
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/v1/cities", cityRouter);
// app.use("/api/v1/user", userRouter);
module.exports = app;
