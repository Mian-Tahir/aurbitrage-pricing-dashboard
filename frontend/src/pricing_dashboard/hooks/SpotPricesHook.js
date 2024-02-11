import { useState, useEffect } from "react";

const useSpotPricesHook = () => {
  const [spotPrices, setSpotPrices] = useState([]);
  const [loading, setLoading] = useState("loading");

  const fetchSpotPrices = async () => {
    try {
      const response = await fetch("/api/v1/pricing/spot");
      const result = await response.json(); 
      if (result.success){
        setSpotPrices(result.data);
        setLoading("success")
      } else {
        setLoading("failed")
      }
    } catch (error) {
      console.error("Error fetching spot prices:", error);
      setLoading("failed");
    }
  };

  useEffect(() => {
    fetchSpotPrices();

    const intervalId = setInterval(fetchSpotPrices, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return { spotPrices, loading };
};

export default useSpotPricesHook;
