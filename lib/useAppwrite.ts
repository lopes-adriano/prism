import { useState, useEffect } from "react";
import { Alert } from "react-native";

const useAppwrite = (fn, params?: any) => {
    const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchData = async () => {
    setIsLoading(true);

    try {
      const response = await fn(params);

      setData(response.documents);
    } catch (error) {
      Alert.alert("Erro", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetchData = () => { fetchData()};

  return { data, isLoading, refetchData };
}

export default useAppwrite