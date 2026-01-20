import axiosInstance from "./axiosInstance";

// Suggest an outfit based on preferences
export const suggestOutfit = async (preferences) => {
    const response = await axiosInstance.post("/outfit/suggest", preferences);
    return response.data;
};

// Get recent outfits
export const getRecentOutfits = async () => {
    const response = await axiosInstance.get("/outfit/recent");
    return response.data;
};
