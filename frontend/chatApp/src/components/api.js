import axios from "axios";


const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
    withCredentials: true
})
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config

})


api.interceptors.response.use(
    (response) => response,
    async (err) => {
        const originalRequest = err.config;
        if (err.response?.status == 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refresh');
                const res = await axios.post('http://127.0.0.1:8000/accounts/api/token/refresh/', {
                    refresh: refreshToken,
                })
                const newAccessToken = res.data.access;
                localStorage.setItem('access', newAccessToken)
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
                return api(originalRequest)
            }

            catch {
                localStorage.clear();
                window.location.href = "/login";
                return Promise.reject(err);
            }
        }
        return Promise.reject(err);
    }
    
)


export default api