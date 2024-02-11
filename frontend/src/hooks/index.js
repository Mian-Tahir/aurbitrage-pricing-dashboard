
import { useState, useEffect } from 'react';
const useApiCall = (apiEndpoint) => {
  const [data, setData] = useState({});
  const [loading,setLoading]=useState("loading")
  
  const fetchData = async () => {
    try {
      setLoading("loading")
      const response = await fetch(apiEndpoint);
      const result = await response.json(); 
      setData(result);
      setLoading("sucess")
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading("failed")
    }
  };
  useEffect(() => {
    fetchData();
  }, [apiEndpoint]);

  return {data, loading};
};

export default useApiCall;
