import axiosInstance from "./axiosInstance";

export const getDestinations = async () => {
  const { data } = await axiosInstance.get("/destinations");
  return data;
};

export const getDestinationById = async (id) => {
  const { data } = await axiosInstance.get(`/destinations/${id}`);
  return data;
};