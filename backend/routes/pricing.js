var express = require("express");
var router = express.Router();
const PricingController = require("../controllers/pricing");
const config = require("../config");

exports.routersConfig = (app, router) => {
  const group = `${config.app.apiPath}/pricing`;
  
  router.get(group + "/all", PricingController.getPricingData);

  router.get(group + "/spot", PricingController.getSpotPricesData)

};
