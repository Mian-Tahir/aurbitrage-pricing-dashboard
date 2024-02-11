var express = require("express");
const SkuRelationsController = require("../controllers/skuRelations");
const config = require("../config");

exports.routersConfig = (app, router) => {
  const group = `${config.app.apiPath}/sku-relations`;

  router.get(group + "/unmapped", SkuRelationsController.getUnmappedSkus)

  router.get(group + "/distinct-aurbitrage-skus", SkuRelationsController.getDistinctAurbitrageSKUMeta)

  router.post(group + "/assign", SkuRelationsController.assignSkuRelation)
};
