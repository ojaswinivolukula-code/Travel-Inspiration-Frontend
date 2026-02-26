import { createContext, useContext, useState, useEffect } from "react";
import { getDestinations } from "../services/destinationService";

export const DestinationContext = createContext();
export const useDestination = () => useContext(DestinationContext);

export const DestinationProvider = ({ children }) => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await getDestinations();
        setDestinations(data);
      } catch (error) {
        console.error("Failed to fetch destinations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  return (
    <DestinationContext.Provider value={{ destinations, loading }}>
      {children}
    </DestinationContext.Provider>
  );
};