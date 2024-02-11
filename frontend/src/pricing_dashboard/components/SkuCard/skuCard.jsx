import SkuTable from "./skuTable";
import React from "react";

const SkuCard = (props) => {
  const [showRetail, setShowRetail] = React.useState(false);
  const toggleRetail = () => {
    setShowRetail((p) => !p);
  };
  const retailDealers = ["APMEX", "JM Bullion", "SD Bullion"];


  const pricingData = React.useMemo(() => {
    let filteredData = props.skuData.filter(
      (item) =>
        item.price &&
        (props.dealerFilter.includes(item.Dealer) ||
          props.dealerFilter.length === 0)
          
    );
    let retail = [];
    let wholeSale = [];
    filteredData.forEach((element) => {
      if (retailDealers.includes(element.Dealer)) {
        retail.push(element);
      } else {
        wholeSale.push(element);
      }
   
    });
   
    return {retail, wholeSale}
  }, [props.skuData,props.dealerFilter]);

  React.useEffect(()=>{
    setShowRetail(props.displayRetail)
  },[props.displayRetail])

  return (
    <React.Fragment>
      {!(props.displayRetail && pricingData.wholeSale.length === 0) && <SkuTable
        {...props}
        skuData={pricingData.wholeSale}
        toggleRetail={toggleRetail}
        isRetailActive={showRetail}
        isRetailPresent={pricingData.retail.length>0}
      />}
      {showRetail && pricingData.retail.length !==0 && (
        <SkuTable
          {...props}
          skuData={pricingData.retail}
          showRetail={showRetail}
        />
      )}
    </React.Fragment>
  );
};

export default SkuCard;
