const mongoose = require("mongoose");
const config = require("../config");

module.exports = function () {
  const db = config.db;
  //const db = "mongodb://localhost/citas";
  /* const db =
    "mongodb+srv://citasuser:citasuser@cluster0.4q602.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
 */
  mongoose
    .connect(db)
    .then(() => console.log("Connected to MongoDB..."))
    .catch((err) => console.error(err, "Could not connect to MongoDB..."));
};
