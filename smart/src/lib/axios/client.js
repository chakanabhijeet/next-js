// import axios from "axios";
// import { BASE_URL } from "@/config/env";

// const apiClient = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   timeout: 30000,
// });
// console.log(apiClient);
// export default apiClient;



// import axios from "axios";
// import { BASE_URL } from "@/config/constants";

// const apiClient = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default apiClient; 


// import axios from "axios";
// import { BASE_URL } from "@/config/constants";

// const apiClient = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// apiClient.interceptors.request.use(
//   (config) => {
//     const token = 
//       typeof window !== "undefined"
//         ? localStorage.getItem("access_token")
//         : null;

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default apiClient;




// import axios from "axios";
// import { BASE_URL } from "@/config/constants";

// const apiClient = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// const STATIC_ACCESS_TOKEN = "PASTE_YOUR_ACCESS_TOKEN_HERE";

// apiClient.interceptors.request.use(
//   (config) => {
//     if (STATIC_ACCESS_TOKEN) {
//       config.headers.Authorization = `Bearer ${STATIC_ACCESS_TOKEN}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default apiClient;




// import axios from "axios";
// import { BASE_URL } from "@/config/constants";

// const apiClient = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// apiClient.interceptors.request.use(
//   (config) => {
//     if (typeof window !== "undefined") {
//       const token = localStorage.getItem("token");

//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default apiClient;





import axios from "axios";
import { BASE_URL } from "@/config/constants";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
