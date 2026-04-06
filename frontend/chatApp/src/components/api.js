import axios from "axios";

// 🔥 IMPORTANT: must be set in .env
// REACT_APP_API_URL=http://43.205.94.202:8001
const BASE_URL = process.env.REACT_APP_API_URL;

if (!BASE_URL) {
    throw new Error("REACT_APP_API_URL is not defined");
}

// Create axios instance
const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

// 🔐 Attach access token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 🔁 Handle token refresh automatically
api.interceptors.response.use(
    (response) => response,
    async (err) => {
        const originalRequest = err.config;

        // If unauthorized and not retried yet
        if (err.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refresh");

                if (!refreshToken) {
                    throw new Error("No refresh token available");
                }

                // Request new access token
                const res = await axios.post(
                    `${BASE_URL}/accounts/api/token/refresh/`,
                    { refresh: refreshToken }
                );

                const newAccessToken = res.data.access;

                // Save new token
                localStorage.setItem("access", newAccessToken);

                // Update header and retry original request
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);

                // Clear auth and redirect to login
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");

                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(err);
    }
);

export default api;