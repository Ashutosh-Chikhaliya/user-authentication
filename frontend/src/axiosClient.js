// import axios from "axios";

// const API_BASE_URL = "http://localhost:8080/api/user";

// export const register = async (userData) => {
//   return await axios.post(`${API_BASE_URL}/register`, userData);
// };

// export const login = async (credentials) => {
//   return await axios.post(`${API_BASE_URL}/login`, credentials, {
//     withCredentials: true,
//   });
// };

// export const getAuthenticatedUser = async () => {
//   return await axios.get(`${API_BASE_URL}/user`, {
//     withCredentials: true, // Include cookies in requests
//   });
// };
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
