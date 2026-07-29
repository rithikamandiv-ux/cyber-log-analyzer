import api from "./api";

export const alertService = {
  getAlerts: async (filters?: Record<string, string | boolean | number>) => {
    const response = await api.get("/alerts", {
      params: filters,
    });

    return response.data;
  },

  resolveAlert: async (id: number) => {
    const response = await api.patch(`/alerts/${id}/resolve`);
    return response.data;
  },
};