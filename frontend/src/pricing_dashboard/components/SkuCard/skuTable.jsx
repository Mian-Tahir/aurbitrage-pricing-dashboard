import {
  Card,
  CardContent,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquarePlus,
  faHeart as faHeartRegular,
} from "@fortawesome/free-regular-svg-icons";
import {
  faStore,
  faHeart as faHeartSolid,
} from "@fortawesome/free-solid-svg-icons";

import { styled } from "@mui/system";
import React from "react";

const SkuContainer = styled("div")(({ theme }) => ({
  marginBottom: "10px",
  "& .skuCard": {
    display: "flex",
    minWidth: "250px",
    maxWidth: "300px",
    height: "100%",
    marginRight: "20px",
    alignContent: "space-between",
    backgroundColor: theme.palette.background.card,
    borderRadius: "5px",
  },
  "& .skuCard.retail": {
    backgroundColor: theme.palette.background.paper,
  },
  "& .skuTitle": {
    textAlign: "center",
    display: "flex",
    fontSize: "13px",
    fontWeight: 600,
    justifyContent: "center",
    color: theme.typography.color.secondary,
    alignItems: "center",
  },
  "& .actionButtons": {
    marginTop: "3px",
    marginBottom: "1px",
    padding: "6px 6px",
    // borderRadius: "15px",
    fontSize: "12px",
    width: "90px",
    fontWeight: 550,
    color: theme.typography.color.contrast,
    backgroundColor: "#3e4a61",
    "&[disabled]": {
      filter: "grayscale(80%) contrast(70%)",
      opacity: 0.8,
    },
  },
  "& table": {
    borderCollapse: "separate",
    borderSpacing: "0px 2px",
    overflow: "hidden",

    "& th": {
      textAlign: "center",
      padding: "0px",
      fontSize: "11.5px",
    },
    "& td": {
      textAlign: "center",
      padding: "2px",
      fontSize: "11.5px",
      "&:first-child": {
        borderRadius: "5px 0 0 5px",
      },
      "&:last-child": {
        borderRadius: "0 5px 5px 0",
      },
    },
  },
}));

const SkuTable = ({
  sku,
  skuData,
  showRetail,
  toggleRetail,
  isRetailActive,
  isRetailPresent,
  toggleFavorites,
  isFavorite,
}) => {
  const tableBaseLength = 3;

  const [showAll, setShowAll] = React.useState(false);

  const pricesByType = React.useMemo(() => {
    let ask = [];
    let bid = [];
    skuData.forEach((element) => {
      if (element.type === "bid") {
        bid.push(element);
      } else {
        ask.push(element);
      }
    });
    return { ask, bid };
  }, [skuData]);

  const toggleShowAll = () => {
    setShowAll((p) => !p);
  };

  const getPaddedSKUPricesByType = (type, pad = false) => {
    let prices = (type === "bid" ? pricesByType.bid : pricesByType.ask).sort(
      (a, b) => (type === "bid" ? b.price - a.price : a.price - b.price)
    );

    if (pad) {
      prices = prices
        .concat(Array(tableBaseLength).fill({}))
        .slice(0, tableBaseLength);
    }
    return type === "bid" ? prices : prices.reverse();
  };
  const getRowStyle = (dataAgeHours) => {
    if (dataAgeHours <= 1) {
      return { backgroundColor: "#CBFF8C" }; // <= 1 hour
    } else if (dataAgeHours <= 3) {
      return { backgroundColor: "#E3E36A" }; // <= 3 hours
    } else if (dataAgeHours <= 6) {
      return { backgroundColor: "#C16200" }; // <= 6 hours
    } else if (dataAgeHours <= 12) {
      return { backgroundColor: "#881600" }; // <= 12 hours
    } else {
      return { backgroundColor: "#4E0110" }; // > 12 hours
    }
  };

  const getTextColor = (backgroundColor) => {
    const threshold = 130;

    const hexToRgb = (hex) => {
      const bigint = parseInt(hex.slice(1), 16);
      return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
    };

    const rgb = hexToRgb(backgroundColor);
    const luminance = 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];

    return luminance > threshold ? "#000000" : "#FFFFFF";
  };

  const formatPrice = (skuItem) => {
    const item = { ...skuItem };
    if (item && item.price) {
      item.price = item.price.toFixed(2);
      if (item.format === "%") {
        return `${item.price}%`;
      } else if (item.format === "$") {
        return `$${item.price}`;
      } else return item.price || "-";
    }
    return "-";
  };

  return (
    <SkuContainer key={`${sku}-category`}>
      <Card className={`skuCard ${showRetail ? "retail" : ""}`} elevation={3}>
        <CardContent style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              width: "100%",
              margin: "auto",
              padding: "0px",
            }}
          >
            <div className="skuTitle">
              {showRetail && (
                <>
                  Retail
                  <br />
                </>
              )}
              {sku} &nbsp;&nbsp;
              {showRetail && <FontAwesomeIcon size="xl" icon={faStore} />}
              {!showRetail && (
                <FontAwesomeIcon
                  size="xl"
                  color={isFavorite ? "#f54f63" : ""}
                  style={{ cursor: "pointer" }}
                  icon={isFavorite ? faHeartSolid : faHeartRegular}
                  onClick={() => {
                    toggleFavorites(sku);
                  }}
                />
              )}
            </div>
            <TableContainer
              style={{
                marginTop: "auto",
              }}
            >
              <Table layout="" style={{ textAlign: "center" }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Price</TableCell>
                    <TableCell>Dealer</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getPaddedSKUPricesByType("ask", !showAll).map(
                    (skuItem, index) => (
                      <TableRow
                        key={index}
                        style={{
                          ...getRowStyle(skuItem.dataAgeHours),
                          height: "30px",
                          marginBottom: "8px",
                          marginTop: "8px",
                          borderRadius: "15px",
                          visibility: skuItem.price ? "visible" : "hidden",
                        }}
                      >
                        <TableCell
                          style={{
                            color: getTextColor(
                              getRowStyle(skuItem.dataAgeHours).backgroundColor
                            ),
                          }}
                        >
                          {formatPrice(skuItem)}
                        </TableCell>
                        <TableCell
                          style={{
                            color: getTextColor(
                              getRowStyle(skuItem.dataAgeHours).backgroundColor
                            ),
                          }}
                        >
                          {skuItem.Dealer}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      style={{
                        padding: "0 4%",
                      }}
                    >
                      <hr
                        style={{
                          border: "1.5px solid #9f9f9f",
                          borderRadius: "5px",
                        }}
                      />
                    </TableCell>
                  </TableRow>

                  {getPaddedSKUPricesByType("bid", !showAll).map(
                    (skuItem, index) => (
                      <TableRow
                        key={index}
                        style={{
                          ...getRowStyle(skuItem.dataAgeHours),
                          height: "30px",
                          marginBottom: "8px",
                          marginTop: "8px",
                          visibility: skuItem.price ? "visible" : "hidden",
                        }}
                      >
                        <TableCell
                          style={{
                            color: getTextColor(
                              getRowStyle(skuItem.dataAgeHours).backgroundColor
                            ),
                          }}
                        >
                          {formatPrice(skuItem)}
                        </TableCell>
                        <TableCell
                          style={{
                            color: getTextColor(
                              getRowStyle(skuItem.dataAgeHours).backgroundColor
                            ),
                          }}
                        >
                          {skuItem.Dealer}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  height: "calc(1em + 2*6px + 2*1px + 3px)",
                }}
              >
                {(pricesByType.ask.length > tableBaseLength ||
                  pricesByType.bid.length > tableBaseLength) && (
                  <button
                    className="actionButtons"
                    onClick={toggleShowAll}
                    style={{ filter: showAll ? "invert(100%)" : "" }}
                  >
                    Show All &nbsp;
                    <FontAwesomeIcon icon={faSquarePlus} />
                  </button>
                )}
                {!showRetail && (
                  <button
                    disabled={!isRetailPresent}
                    style={{ filter: isRetailActive ? "invert(100%)" : "" }}
                    className="actionButtons"
                    onClick={() => {
                      toggleRetail();
                    }}
                  >
                    Retail &nbsp;
                    <FontAwesomeIcon icon={faStore} />
                  </button>
                )}
              </div>
            </TableContainer>
          </div>
        </CardContent>
      </Card>
    </SkuContainer>
  );
};

export default SkuTable;
