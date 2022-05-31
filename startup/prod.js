const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const bodyparser = require("body-parser");

module.exports = function (app) {
  //app.use(bodyparser.urlencoded({ extended: false }));
  //app.use(bodyparser.json());
  app.use(cors());
  app.use(helmet());
  app.use(compression());
};
