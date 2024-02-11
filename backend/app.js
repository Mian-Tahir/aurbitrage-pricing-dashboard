var createError = require("http-errors");
const https = require("https");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const router = express.Router();
const config = require("./config");
const fs = require("fs");
var PricingRouter = require("./routes/pricing");
var SkuRelationsRouter = require("./routes/skuRelations");

var app = express();

if (config.app.APP_ENV !== "production") {
  app.set("env", "dev");
}

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

PricingRouter.routersConfig(app, router);
SkuRelationsRouter.routersConfig(app, router);

app.use("/", router);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (config.app.APP_ENV === "production") {
  const options = {
    key: fs.readFileSync("server.key"),
    cert: fs.readFileSync("server.crt"),
  };

  https.createServer(options, app).listen(config.app.PORT, "0.0.0.0", () => {
    console.log(
      "server started on:",
      config.app.PORT,
      " ENV=",
      config.app.APP_ENV
    );
  });
} else {
  app.listen(config.app.PORT, "0.0.0.0", () => {
    console.log(
      "server started on:",
      config.app.PORT,
      " ENV=",
      config.app.APP_ENV
    );
  });
}

module.exports = app;
