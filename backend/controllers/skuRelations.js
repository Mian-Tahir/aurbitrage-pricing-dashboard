const RelationsQuery = require("../queries/skuRelations");
const PricingQuery = require("../queries/pricing");
const Validator = require("validatorjs");
const apiResponse = require("../schema/api.response");

exports.getUnmappedSkus = async (req, res) => {
  try {
    const { getUnmappedSKUs } = RelationsQuery;
    const data = await getUnmappedSKUs();
    apiResponse.success(res, req, data[0]);
  } catch (error) {
    console.log(error.message);
    apiResponse.fail(res, error.message, 500);
  }
};

exports.getDistinctAurbitrageSKUMeta = async (req, res) => {
  try {
    const { getDistinctAurbitrageSKUs } = RelationsQuery;
    const { getAllDealers } = PricingQuery;

    const data = await Promise.all([
      getDistinctAurbitrageSKUs(),
      getAllDealers(),
    ]);

    const [Aurbitrage_SKU] = data[0];
    const [Dealers] = data[1];

    const result = {
      AurbitrageSKU: Aurbitrage_SKU.map((i) => i.Aurbitrage_SKU),
      Dealers: Dealers.map((i) => i.Dealer),
    };

    apiResponse.success(res, req, result);
  } catch (error) {
    console.log(error.message);
    apiResponse.fail(res, error.message, 500);
  }
};

exports.assignSkuRelation = async (req, res) => {
  try {
    const validation = new Validator(req.body, {
      dealer: "required",
      sku: "required",
      aurbitrageSku: "required",
    });
    if (validation.fails()) {
       throw validation.errors
    }

    let [relation] = await RelationsQuery.getSkuRelation(req.body.aurbitrageSku);

    if (!relation || relation.length === 0) {
      throw Error(`Aurbitrage SKU: '${req.body.aurbitrageSku}' does not exist`);
    }

    relation = relation[0];

    relation = {
      ...relation,
      Dealer: req.body.dealer,
      Dealer_SKU: req.body.sku,
    };
    await RelationsQuery.insertSkuRelation(relation);

    apiResponse.success(res, req, `SKU relation for ${req.body.sku} assigned`);
  } catch (error) {
    console.log(error.errors || error.message);
    apiResponse.fail(res, error?.message || error, 500);
  }
};
