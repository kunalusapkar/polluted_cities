// require('dotenv').config()
const app = require("./app");
const port = process.env.PORT || 3000;
console.log("process.env.PORT------>", process.env.PORT);

const server = app.listen(port, () => {
  console.log("Server is launching");
});

