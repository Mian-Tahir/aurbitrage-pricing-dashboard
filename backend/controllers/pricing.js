const PricingQuery = require("../queries/pricing");
const apiResponse = require("../schema/api.response");

exports.getPricingData = async (req, res) => {
  try {
    const { getAllSKUs, getAllCategories, getAllSubCategories, getAllDealers } =
      PricingQuery;
    params = {};

    const data = await Promise.all([
      getAllSKUs(params),
      getAllCategories(),
      getAllSubCategories(),
      getAllDealers(),
    ]);

    const [Pricelist] = data[0];
    const [Categories] = data[1];
    const [SubCategories] = data[2];
    const [Dealer] = data[3];
    const results = {
      Pricelist,
      Categories: Categories.map((c) => c.Category),
      SubCategories: SubCategories.map((s) => s.Sub_Category),
      Dealer: Dealer.map((d) => d.Dealer),
    };
    apiResponse.success(res, req, results);
  } catch (error) {
    console.log(error.message);
    apiResponse.fail(res, error.message, 500);
  }
};

exports.getSpotPricesData = async (req, res) => {
  try {
    const { getSpotPrices } = PricingQuery;
    const data = await getSpotPrices();
    apiResponse.success(res, req, data);
  } catch (error) {
    console.log(error.message);
    apiResponse.fail(res, error.message, 500);
  }
};
