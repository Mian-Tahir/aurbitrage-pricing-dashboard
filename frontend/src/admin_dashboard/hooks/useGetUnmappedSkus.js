
import { useState, useEffect } from 'react';


const useGetUnmappedSkus = () => {
  const [data, setData] = useState([]);
  const [loading,setLoading]=useState("loading")

  const apiEndpoint = '/api/v1/sku-relations/unmapped';
  
  const fetchData = async () => {
    try {
      setLoading("loading")
      const response = await fetch(apiEndpoint);
      const result = await response.json(); 
      if (result.success){
        setData(result.data);
        setLoading("success")
      } else {
        setLoading("failed")
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading("failed")
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {data, loading};
};

export default useGetUnmappedSkus;
