const express = require("express");
const winston = require("winston");
const app = express();


require("./startup/db")();
require("./startup/prod")(app);
require("./startup/config")();
require("./startup/routes")(app);
require("./startup/validation")();

const port = process.env.PORT || 5000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));
