import axios from "axios";
import { useSettings } from "../contexts/SettingsContext";
import { getApiBaseUrl } from "../constants";

// export const createApiClient = () => {
//   const { settings } = useSettings();

//   const instance = axios.create({
//     baseURL: settings.apiBaseUrl,
//     timeout: 10000,
//   });

//   instance.interceptors.response.use(
//     response => response,
//     error => {
//       if (error.response) {
//         return Promise.reject(error.response.data);
//       }
//       return Promise.reject(error);
//     }
//   );

//   return instance;
// };

const axiosClient = axios.create({
  baseURL: getApiBaseUrl() || "http://localhost:5000/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": true
  },
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;