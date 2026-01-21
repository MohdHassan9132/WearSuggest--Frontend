import axiosInstance from "./axiosInstance";

export const addClothingItem = async (formData) => {
    const response = await axiosInstance.post("/clothing", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};


export const getClothingItems = async (params = {}) => {
    const response = await axiosInstance.get("/clothing", { params });
    return response.data;
};

export const getClothingItemById = async (id) => {
    const response = await axiosInstance.get(`/clothing/${id}`);
    return response.data;
};

export const deleteClothingItem = async (id) => {
    const response = await axiosInstance.delete(`/clothing/${id}`);
    return response.data;
};


export const getDeletedClothingItems = async () => {
    const response = await axiosInstance.get("/clothing/deleted");
    return response.data;
};


export const restoreClothingItem = async (id) => {
    const response = await axiosInstance.patch(`/clothing/${id}/restore`);
    return response.data;
};


export const analyzeImage = async (formData) => {
    const response = await axiosInstance.post("/clothing/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};
