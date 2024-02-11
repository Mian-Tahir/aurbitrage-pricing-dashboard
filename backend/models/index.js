"use strict";
const { BigQuery } = require("@google-cloud/bigquery");
const { GBQ } = require("./../config");
const db = {};

const authOptions = {
  keyFilename: GBQ.keyFilePath,
  projectId: GBQ.projectId,
  location: "US",
};

const bigqueryClient = new BigQuery(authOptions);

db.Query = (query) => {
  const templateKey = "<DATASET>";

  const dataset = `${GBQ.projectId}.${GBQ.dataset}`;

  if (query.search(templateKey) === -1) {
    throw Error(
      `Invalid Query Passed. Does not contain dataset template ${templateKey} `
    );
  }
  query = query.replaceAll(templateKey, dataset);

  const options = {
    query: query,
    location: "US",
  };
  return bigqueryClient.query(options);
};

db.Insert = (table, row) => {
  const dataset = GBQ.dataset
  return bigqueryClient.dataset(dataset).table(table).insert(row);
};

module.exports = db;
