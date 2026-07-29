import api from "./api";

export const mlService = {
    getStatus: async () => {
        const response = await api.get("/ml/status");
        return response.data;
    },
};
