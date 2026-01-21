import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error = null) => {
    failedQueue.forEach(promise => {
        if (error) promise.reject(error);
        else promise.resolve();
    });
    failedQueue = [];
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;

        // Do not retry login or refresh endpoints
        if (
            originalRequest.url?.includes("/users/login") ||
            originalRequest.url?.includes("/users/refresh-access-token")
        ) {
            return Promise.reject(error);
        }

        if (status === 498 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => axiosInstance(originalRequest))
                    .catch(err => Promise.reject(err));
            }

            isRefreshing = true;

            try {
                await axiosInstance.post("/users/refresh-access-token");
                isRefreshing = false;
                processQueue();
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                isRefreshing = false;
                processQueue(refreshError);
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
