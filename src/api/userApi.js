import axiosInstance from "./axiosInstance";

// Register a new user
export const registerUser = async (userData) => {
    const response = await axiosInstance.post("/users/register-user", userData);
    return response.data;
};

// Login user
export const loginUser = async (credentials) => {
    const response = await axiosInstance.post("/users/login-user", credentials);
    return response.data;
};

// Logout user
export const logoutUser = async () => {
    const response = await axiosInstance.post("/users/logout-user");
    return response.data;
};

// Refresh access token
export const refreshAccessToken = async () => {
    const response = await axiosInstance.post("/users/refresh-access-token");
    return response.data;
};

// Update password
export const updatePassword = async (passwordData) => {
    const response = await axiosInstance.patch("/users/update-password", passwordData);
    return response.data;
};

// Get current user
export const getCurrentUser = async () => {
    const response = await axiosInstance.get("/users/get-current-user");
    return response.data;
};
