import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:9000/api/v1",
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 498 (Token Expired) and we haven't retried yet
        if (error.response?.status === 498 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh token
                await axiosInstance.post("/users/refresh-access-token");

                // Retry original request
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // If refresh fails, redirect to login or handle logout
                console.error("Session expired, please login again.");
                // Optional: window.location.href = '/login'; 
                // Better to let the app handle auth state change but redirect is a safe fallback
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
