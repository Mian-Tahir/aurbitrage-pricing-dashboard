const queryDB = require("../models").Query;

//Use <DATASET> as template for <projectID>.<Dataset> in the table path. This will be automatically replaced with the configured path by the model

exports.getAllSKUs = (params) => {
  let sqlQuery = "";

  if (params.limit) {
    sqlQuery = `
        SELECT *, 
          TIMESTAMP_DIFF(CURRENT_TIMESTAMP(), TIMESTAMP(Date), HOUR) AS data_age_hours
        FROM \`<DATASET>.joined_realtions_pricelist\`
        ORDER BY Date DESC
        LIMIT ${params.limit}`;
  } else {
    sqlQuery = `
        SELECT *, 
          TIMESTAMP_DIFF(CURRENT_TIMESTAMP(), TIMESTAMP(Date), HOUR) AS data_age_hours
        FROM \`<DATASET>.joined_relations_pricelist\`
        ORDER BY Date DESC`;
  }
  return queryDB(sqlQuery);
};

exports.getAllCategories = (params) => {
  let sqlQuery = `SELECT Distinct(Category) as Category FROM \`<DATASET>.sku_relations_distinct\``;

  return queryDB(sqlQuery);
};

exports.getAllSubCategories = (params) => {
  let sqlQuery = `SELECT Distinct(Sub_Category) FROM \`<DATASET>.sku_relations_distinct\``;

  return queryDB(sqlQuery);
};

exports.getAllDealers = (params) => {
  let sqlQuery = `SELECT Distinct(Dealer) FROM \`<DATASET>.sku_relations_distinct\``;

  return queryDB(sqlQuery);
};

exports.getSpotPrices = () => {
  let sqlQuery = `
    SELECT
      Metals,
      Ask,
      Ask_Change,
      Bid_Change
    FROM
      \`<DATASET>.spot_prices\`
   `;

  const options = {
    query: sqlQuery,
    location: "US",
  };

  return queryDB(sqlQuery);
};
