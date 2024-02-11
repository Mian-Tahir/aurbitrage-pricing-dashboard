import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import useSpotPricesHook from "@/pricing_dashboard/hooks/SpotPricesHook";

const SportPriceRibbon = () => {
  const { spotPrices, loading } = useSpotPricesHook();


  const itemWidth = `${100 / spotPrices.length}%`;

  if (loading !== "success"){
    return<></>
  }

  return (
    <div style={{ width: "100%", backgroundColor: "#152d32" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          flexWrap: "wrap",
          padding: "8px 0",
        }}
      >
        {spotPrices.map((setOfSpotPrices, index) => (
          <div
            key={index}
            style={{
              flex: `0 0 ${itemWidth}`,
              padding: "8px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              fontWeight: "500",
              "@media screen and (maxWidth: 350px)": {
                flex: "0 0 100%",
                justifyContent: "center",
                padding: "2px",
                width: "50px",
              },
            }}
          >
            {setOfSpotPrices.map((price, innerIndex) => {
              const color = price.Bid_Change > 0 ? "green" : "red";
              const arrow =
                price.Bid_Change > 0 ? (
                  <FontAwesomeIcon icon={faCaretUp} />
                ) : (
                  <FontAwesomeIcon icon={faCaretDown} />
                );

              return (
                <div
                  key={innerIndex}
                  style={{
                    margin: "auto",
                    textAlign: "center",
                  }}
                >
                  <span style={{ color: "#D3D3D3" }}>{price.Metals} </span>
                  <span style={{ marginLeft: "10px", color: "#D3D3D3" }}>
                    {"$" + price.Ask}
                  </span>
                  <span style={{ marginLeft: "10px", color: color }}>
                    {"$" + price.Bid_Change}
                  </span>
                  <span
                    style={{
                      marginLeft: "10px",
                      marginRight: "20px",
                      color: color,
                    }}
                  >
                    {arrow} {price.Ask_Change}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SportPriceRibbon;
