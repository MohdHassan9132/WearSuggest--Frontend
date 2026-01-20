import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:9000/api/v1",
    withCredentials: true,
});

export default axiosInstance;
