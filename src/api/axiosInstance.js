import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:9000/api/v1",
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 498 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await axiosInstance.post("/users/refresh-access-token");
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error("Session expired, please login again.");
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
