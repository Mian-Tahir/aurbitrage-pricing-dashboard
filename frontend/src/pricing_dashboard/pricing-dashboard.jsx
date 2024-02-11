import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Tooltip,
  Switch,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQuestionCircle,
  faTriangleExclamation,
  faHeart,
  faCoins,
} from "@fortawesome/free-solid-svg-icons";

import InfiniteScroll from "react-infinite-scroll-component";
import { FilterGroup } from "@/components/FilterGroup";
import React, { useState, useEffect, useMemo } from "react";
import { styled } from "@mui/system";
import useGetPricelist from "./hooks/priceList";
import SkuCard from "./components/SkuCard";
import { SearchBar } from "@/components/SearchBar/SearchBar";
import SportPriceRibbon from "./components/SpotPriceRibbon";
import LoginButton from "../components/LoginButton";

import ls from "localstorage-slim";

const StyledDiv = styled("div")(({ theme }) => ({
  minWidth: "80vw",
  minHeight: "80vh",
  color: theme.typography.color.primary,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2, 4),
  "& .dashboardHeader": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 10px 0 10px",
    margin: "-40px -30px 0px -30px",
    position: "sticky",
    top: 0,
    backgroundColor: theme.palette.background.paper,
    zIndex: 11,
  },
  "& .tabsHeader": {
    zIndex: 10,
    position: "sticky",
    top: "calc(2em + 20px + 10px)",
    marginBottom: "10px",
    backgroundColor: theme.palette.background.paper,
  },
  "& .categoryHeader": {
    zIndex: 9,
    position: "sticky",
    top: "calc(2em + 20px + 10px + 70px)",
    backgroundColor: theme.palette.background.paper,
    paddingTop: "10px",
    paddingBottom: "10px",
    "& .title": {
      fontWeight: "600",
    },
  },
  "& .subCategoryCard": {
    width: "90vw",
    margin: "20px auto",
    backgroundColor: "white",
    marginBottom: "10px",
    borderRadius: "8px",
  },
  "& .subCategoryHeader": {
    textAlign: "left",
    marginBottom: "20px",
    fontWeight: "600",
  },

  "& .priceLabels": {
    display: "flex",
    flexDirection: "column",
    marginRight: "10px",
    borderRadius: "8px",
    fontSize: "13px",
    marginTop: "auto",
    marginBottom:
      "calc(10px + 24px + 1em + 2*6px + 2*1px + 3px + 2*30px + 25px)",
    marginLeft: "0px",
    "& .labelItem": {
      height: "30px",
      lineHeight: "30px",
      padding: "0 6px",
      width: "90px",
      backgroundColor: theme.palette.background.contrast,
      color: theme.typography.color.primary,
      borderRadius: "5px",
      fontWeight: 600,
    },
  },
  "& .subCategoryContainer": {
    display: "flex",
    flexDirection: "row",
    scrollX: "hidden",
    alignItems: "stretch",
    overflow: "hidden",
  },
  "& .label": {
    height: "32px",
    display: "flex",
    padding: "0 12px",
    backgroundColor: "#C0C0C0",
    borderRadius: "5px",
    fontWeight: 600,
    alignItems: "center",
  },
  "& .ribbonFooter": {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    zIndex: 999,
  },
}));

const PricingDashboard = () => {
  const { data: PricingData, loading: pricingLoading } = useGetPricelist();

  const [data, setData] = useState({});
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [subCategoryFilter, setSubCategoryFilter] = useState([]);
  const [dealerFilter, setDealerFilter] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const [skuDataIndex, setSkuDataIndex] = useState({});
  const [catSKUIndexData, setCatSKUIndexData] = useState({});
  const [subCategoryIdx, setSubCategoryIdx] = useState({});
  const [dealerCategoryIdx, setDealerCategoryIdx] = useState({});
  const [visibleCategoryLength, setVisibleCategoryLength] = useState(1);
  const [loadingTimedout, setLoadingTimedout] = useState(false);
  const [showRetail, setShowRetail] = useState(false);
  const [showFav, setShowFav] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const [favoriteSkus, setfavoriteSkus] = useState({});

  React.useEffect(() => {
    if (pricingLoading === "success") {
      setData(PricingData);
    }
  }, [PricingData, pricingLoading]);

  React.useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const newFavorites = JSON.parse(ls.get("userFavoriteSkus") || "{}");
    setfavoriteSkus(newFavorites);
  };

  const saveFavorites = (fav) => {
    const newFavorites = JSON.stringify(fav);
    ls.set("userFavoriteSkus", newFavorites, { ttl: 1209600 });
  };

  const toggleFavorites = (sku) => {
    setfavoriteSkus((f) => {
      const newFavSku = { ...f };
      if (favoriteSkus[sku]) {
        delete newFavSku[sku];
      } else {
        newFavSku[sku] = true;
      }
      saveFavorites(newFavSku);
      return newFavSku;
    });
  };

  function calculateSKUPriceValue(sign, number) {
    if (!number) {
      return null;
    }
    try {
      number = number.replace(",", "");
      const value = parseFloat((sign || "") + number);
      return value;
    } catch (error) {
      console.error("Error calculating value:", error);
      return null;
    }
  }

  const groupDataByCategory = useMemo(() => {
    const skuMap = new Map();
    const subCategoryMap = new Map();
    const dealerCategoryMap = new Map();
    const catSKUIndex = {};

    data?.Pricelist?.forEach((item) => {
      if (!catSKUIndex[item.Category]) {
        catSKUIndex[item.Category] = {};
      }

      if (!catSKUIndex[item.Category][item.Sub_Category]) {
        catSKUIndex[item.Category][item.Sub_Category] = {};
      }

      if (!catSKUIndex[item.Category][item.Sub_Category][item.Aurbitrage_SKU]) {
        catSKUIndex[item.Category][item.Sub_Category][item.Aurbitrage_SKU] = "";
      }

      if (!skuMap.has(item.Aurbitrage_SKU)) {
        skuMap.set(item.Aurbitrage_SKU, []);
      }

      skuMap.get(item.Aurbitrage_SKU).push({
        Aurbitrage_SKU: item.Aurbitrage_SKU,
        price: calculateSKUPriceValue(item.Ask_Sign, item.Ask_Number),
        Dealer: item.Dealer,
        type: "ask",
        format: item.Ask_Format,
        dataAgeHours: item.data_age_hours,
      });
      skuMap.get(item.Aurbitrage_SKU).push({
        Aurbitrage_SKU: item.Aurbitrage_SKU,
        price: calculateSKUPriceValue(item.Bid_Sign, item.Bid_Number),
        Dealer: item.Dealer,
        type: "bid",
        format: item.Bid_Format,
        dataAgeHours: item.data_age_hours,
      });

      if (!dealerCategoryMap.has(item.Dealer)) {
        dealerCategoryMap.set(item.Dealer, []);
      }

      dealerCategoryMap.get(item.Dealer).push(item.Category);
      subCategoryMap.set(item.Sub_Category, item.Category);
    });

    return { skuMap, catSKUIndex, subCategoryMap, dealerCategoryMap };
  }, [data]);

  const loadMoreCategories = () => {
    setVisibleCategoryLength((p) => p + 1);
  };

  useEffect(() => {
    if (
      pricingLoading === "success" &&
      Object.keys(catSKUIndexData).length === 0
    ) {
      setTimeout(() => {
        setLoadingTimedout(true);
      }, 1000);
    }
  }, [pricingLoading, catSKUIndexData]);

  useEffect(() => {
    const { skuMap, catSKUIndex, subCategoryMap, dealerCategoryMap } =
      groupDataByCategory;

    setSkuDataIndex(skuMap);
    setCatSKUIndexData(catSKUIndex);
    setSubCategoryIdx(subCategoryMap);
    setDealerCategoryIdx(dealerCategoryMap);
  }, [data, groupDataByCategory]);

  React.useEffect(() => {
    setVisibleCategoryLength(2);
  }, [
    categoryFilter,
    dealerFilter,
    subCategoryFilter,
    showRetail,
    showFav,
    tabValue,
  ]);

  const isValidSKUitem = (item) => {
    const lowercasedSearchInput = searchInput.toLowerCase();

    return (
      skuDataIndex
        .get(item)
        .filter(
          (p) =>
            p.price &&
            (dealerFilter.includes(p.Dealer) || dealerFilter.length === 0) &&
            (searchInput === "" ||
              p.Aurbitrage_SKU.toLowerCase().includes(lowercasedSearchInput)) &&
            (!showFav || favoriteSkus[p.Aurbitrage_SKU])
        )?.length > 0
    );
  };

  const updateSubCategoryFilter = (subCategories) => {
    const filterCategories = subCategories.map((s) => subCategoryIdx.get(s));
    setCategoryFilter([...filterCategories]);
    setSubCategoryFilter(subCategories);
  };

  const updateCategoryFilter = (categories) => {
    const filterCategories = subCategoryFilter.map((s) =>
      subCategoryIdx.get(s)
    );
    setCategoryFilter(
      Array.from(new Set([...filterCategories, ...categories]))
    );
  };

  const activeCategories = React.useMemo(() => {
    return Object.keys(catSKUIndexData).filter(
      (c) =>
        (categoryFilter.length === 0 || categoryFilter.includes(c)) &&
        (dealerFilter.length === 0 ||
          dealerFilter.some((d) => dealerCategoryIdx.get(d)?.includes(c))) &&
        Object.keys(catSKUIndexData[c]).some((s) =>
          Object.keys(catSKUIndexData[c][s]).some(isValidSKUitem)
        )
    );
  }, [
    catSKUIndexData,
    dealerCategoryIdx,
    dealerFilter,
    categoryFilter,
    searchInput,
    favoriteSkus,
    showFav,
  ]);

  if (
    pricingLoading === "loading" ||
    (pricingLoading === "success" &&
      Object.keys(catSKUIndexData).length === 0 &&
      !loadingTimedout)
  ) {
    return (
      <StyledDiv>
        <div style={{ width: "70vw", margin: "30vh auto" }}>
          <h2> Hold on, we're mining the most up-to-date prices for you! </h2>
          <LinearProgress />
        </div>
      </StyledDiv>
    );
  }

  if (
    pricingLoading === "success" &&
    Object.keys(catSKUIndexData).length === 0 &&
    loadingTimedout
  ) {
    return (
      <StyledDiv>
        <div style={{ width: "70vw", margin: "30vh auto" }}>
          <h2>
            <FontAwesomeIcon size="xl" icon={faTriangleExclamation} />
            &nbsp; Oops, Looks like there is no data to display at the moment.
          </h2>
        </div>
      </StyledDiv>
    );
  }

  if (pricingLoading === "failed") {
    return (
      <StyledDiv>
        <div style={{ width: "70vw", margin: "30vh auto" }}>
          <h2>
            <FontAwesomeIcon size="xl" icon={faTriangleExclamation} />
            &nbsp; Oops, couldn't unearth the market. Let's try digging again!
          </h2>
        </div>
      </StyledDiv>
    );
  }

  return (
    <StyledDiv>
      <>
        <div className="dashboardHeader">
          <h2 style={{ fontSize: "2em", margin: "5px" }}>
            Aurbitrage Dashboard
          </h2>
          <div
            style={{
              display: "flex",
              gap: "20px",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            {" "}
            <div className="label">
              <div style={{ fontSize: "0.8em", cursor: "pointer" }}>
                Show All Retail
              </div>
              <Switch
                checked={showRetail}
                onChange={(e) => {
                  setShowRetail(e.target.checked);
                }}
                inputProps={{ "aria-label": "controlled" }}
              />
            </div>
            <Tooltip
              title={
                <div style={{ alignItems: "center" }}>
                  <div
                    style={{
                      backgroundColor: "#CBFF8C",
                      width: "12px",
                      height: "12px",
                      display: "inline-block",
                      marginRight: "8px",
                    }}
                  ></div>{" "}
                  Up to 1 hour
                  <br />
                  <div
                    style={{
                      backgroundColor: "#E3E36A",
                      width: "12px",
                      height: "12px",
                      display: "inline-block",
                      marginRight: "8px",
                    }}
                  ></div>{" "}
                  Up to 3 hours
                  <br />
                  <div
                    style={{
                      backgroundColor: "#C16200",
                      width: "12px",
                      height: "12px",
                      display: "inline-block",
                      marginRight: "8px",
                    }}
                  ></div>{" "}
                  Up to 6 hours
                  <br />
                  <div
                    style={{
                      backgroundColor: "#881600",
                      width: "12px",
                      height: "12px",
                      display: "inline-block",
                      marginRight: "8px",
                    }}
                  ></div>{" "}
                  Up to 12 hours
                  <br />
                  <div
                    style={{
                      backgroundColor: "#4E0110",
                      width: "12px",
                      height: "12px",
                      display: "inline-block",
                      marginRight: "8px",
                    }}
                  ></div>{" "}
                  More than 12 hours
                </div>
              }
            >
              <div className="label">
                <div style={{ fontSize: "0.8em", cursor: "pointer" }}>
                  Price Age
                </div>
                <div style={{ paddingLeft: "5px" }}>
                  <FontAwesomeIcon
                    icon={faQuestionCircle}
                    size="1x"
                    style={{ cursor: "pointer", boxShadow: "revert" }}
                  />
                </div>
              </div>
            </Tooltip>
            <SearchBar
              searchInput={searchInput}
              setSearchInput={setSearchInput}
            />
            <FilterGroup
              options={data.Categories}
              filters={categoryFilter}
              title="Category"
              onChange={updateCategoryFilter}
            />
            <FilterGroup
              options={data.SubCategories}
              filters={subCategoryFilter}
              title="Sub Category"
              onChange={updateSubCategoryFilter}
            />
            <FilterGroup
              options={data.Dealer}
              filters={dealerFilter}
              title="Dealer"
              onChange={setDealerFilter}
            />
          <LoginButton/>
          </div>
        </div>
        <Box
          sx={{ borderBottom: 1, borderColor: "divider", width: "100%" }}
          className="tabsHeader"
        >
          <Tabs
            value={tabValue}
            onChange={(e, v) => {
              window.scrollTo(0, 0);
              setTabValue(v);
              setShowFav(v === 1);
            }}
            aria-label="dashboard-view-tabs"
            centered
          >
            <Tab
              label="All"
              icon={<FontAwesomeIcon size="xl" icon={faCoins} />}
              iconPosition="end"
              sx={{ "&:focus": { outline: "none" } }}
            />
            <Tab
              label="Favorites"
              icon={<FontAwesomeIcon size="xl" icon={faHeart} />}
              iconPosition="end"
              sx={{ "&:focus": { outline: "none" } }}
            />
          </Tabs>
        </Box>
        {activeCategories.length === 0 ? (
          <div style={{ width: "70vw", margin: "30vh auto" }}>
            <h2>
              {" "}
              {showFav
                ? "No favorites yet. Add your favorite SKUs!"
                : "No SKUs to display"}{" "}
            </h2>
          </div>
        ) : (
          <InfiniteScroll
            dataLength={visibleCategoryLength}
            next={loadMoreCategories}
            hasMore={true}
            style={{ overflow: "none" }}
          >
            {catSKUIndexData &&
              activeCategories
                .slice(0, visibleCategoryLength)
                .map((category, index) => (
                  <div key={category}>
                    <div className="categoryHeader">
                      <Typography className="title" variant="h4" component="h2">
                        {category}
                      </Typography>
                    </div>
                    {catSKUIndexData[category] &&
                      Object.keys(catSKUIndexData[category])
                        .filter(
                          (s) =>
                            (subCategoryFilter.length === 0 ||
                              subCategoryFilter.includes(s)) &&
                            Object.keys(catSKUIndexData[category][s])?.some(
                              isValidSKUitem
                            )
                        )
                        .map((subCategory, index) => (
                          <div key={`${subCategory}-${index}`}>
                            <Card className="subCategoryCard" elevation={5}>
                              <CardContent>
                                <Typography
                                  className="subCategoryHeader"
                                  variant="h5"
                                >
                                  {subCategory}
                                </Typography>
                                <div className="subCategoryContainer">
                                  <div className="priceLabels">
                                    <div className="labelItem">Ask Price</div>
                                    <div style={{ margin: "0 8px" }}>
                                      <hr
                                        style={{
                                          border: "1.5px solid #9f9f9f",
                                          borderRadius: "5px",
                                        }}
                                      />
                                    </div>
                                    <div className="labelItem">Bid Price</div>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      overflowX: "scroll",
                                      alignItems: "stretch",
                                      flexGrow: 1,
                                    }}
                                  >
                                    {catSKUIndexData[category][subCategory] &&
                                      Object.keys(
                                        catSKUIndexData[category][subCategory]
                                      ).map(
                                        (sku) =>
                                          isValidSKUitem(sku) && (
                                            <SkuCard
                                              sku={sku}
                                              skuData={skuDataIndex.get(sku)}
                                              dealerFilter={dealerFilter}
                                              displayRetail={showRetail}
                                              toggleFavorites={toggleFavorites}
                                              isFavorite={favoriteSkus[sku]}
                                            />
                                          )
                                      )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        ))}
                  </div>
                ))}
          </InfiniteScroll>
        )}
      </>
      <div key={`ribbon`} className="ribbonFooter">
        <SportPriceRibbon />
      </div>
    </StyledDiv>
  );
};

export default PricingDashboard;
