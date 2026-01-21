import axiosInstance from "./axiosInstance";

// Add a new clothing item
// Note: This endpoint expects FormData because it handles file uploads
export const addClothingItem = async (formData) => {
    const response = await axiosInstance.post("/clothing", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

// Get all clothing items
// Get all clothing items (supports filtering params like { type: 'top' })
export const getClothingItems = async (params = {}) => {
    const response = await axiosInstance.get("/clothing", { params });
    return response.data;
};

// Get specific clothing item by ID
export const getClothingItemById = async (id) => {
    const response = await axiosInstance.get(`/clothing/${id}`);
    return response.data;
};

// Delete clothing item by ID
export const deleteClothingItem = async (id) => {
    const response = await axiosInstance.delete(`/clothing/${id}`);
    return response.data;
};

// Get deleted clothing items
export const getDeletedClothingItems = async () => {
    const response = await axiosInstance.get("/clothing/deleted");
    return response.data;
};

// Restore clothing item
export const restoreClothingItem = async (id) => {
    const response = await axiosInstance.patch(`/clothing/${id}/restore`);
    return response.data;
};

// Analyze image for auto-tagging
export const analyzeImage = async (formData) => {
    const response = await axiosInstance.post("/clothing/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};
