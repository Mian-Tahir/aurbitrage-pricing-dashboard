import { useState, useEffect } from "react";

const useAssignSkuRelations = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("idle");

  const apiEndpoint = "/api/v1/sku-relations/assign";

  const postData = async (aurbitrageSku, sku, dealer) => {
    try {
      setLoading("loading");
      const body = {
        dealer,
        sku,
        aurbitrageSku,
      };
      const response = await fetch(apiEndpoint, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (result.success) {
        setLoading("success");
        setError("");
      } else {
        setError(result.data);
        setLoading("failed");
      }
    } catch (error) {
      setLoading("failed");
    }
  };

  return { postData, loading, error };
};

export default useAssignSkuRelations;
