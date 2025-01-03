import axios from "axios";

export const authSignup = async (data) => {
  const response = await axios.post(
    `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/signup`,
    data
  );
  return response.data.data;
};

export const authLogin = async (data) => {
  const response = await axios.post(
    `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/login`,
    data
  );
  return response.data.data;
};
