import axiosInstance from "./axiosInstance";

// Login
export const loginUser = async (formData) => {
  if (!formData.email || !formData.password)
    throw new Error("Email and password are required");

  const response = await axiosInstance.post("/auth/login", formData);
  return response.data;
};

// Register
export const registerUser = async (formData) => {
  if (!formData.name || !formData.email || !formData.password)
    throw new Error("Name, email, and password are required");

  const response = await axiosInstance.post("/auth/register", formData);
  return response.data;
};
