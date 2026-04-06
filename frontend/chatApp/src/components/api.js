import axios from "axios";

// 🔥 Hardcoded backend URL
const BASE_URL = "http://43.205.94.202:8001/";

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

// 🔐 Attach JWT token
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

// 🔁 Auto refresh token
api.interceptors.response.use(
    (response) => response,
    async (err) => {
        const originalRequest = err.config;

        if (err.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refresh");

                if (!refreshToken) {
                    throw new Error("No refresh token");
                }

                const res = await axios.post(
                    `${BASE_URL}/accounts/api/token/refresh/`,
                    { refresh: refreshToken }
                );

                const newAccessToken = res.data.access;

                localStorage.setItem("access", newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return api(originalRequest);
            } catch (error) {
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");

                window.location.href = "/login";
                return Promise.reject(error);
            }
        }

        return Promise.reject(err);
    }
);

export default api;