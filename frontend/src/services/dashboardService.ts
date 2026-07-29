import api from "./api";

export const dashboardService = {
  getStats: async () => {
    const response = await api.get("/dashboard");
    return response.data;
  },

  getTimeline: async () => {
    const response = await api.get("/dashboard/timeline");
    return response.data;
  },

  getTopIPs: async () => {
    const response = await api.get("/dashboard/top-ips");
    return response.data;
  },

  getEventTypes: async () => {
    const response = await api.get("/dashboard/event-types");
    return response.data;
  },

  getRecentAlerts: async () => {
    const response = await api.get("/dashboard/recent-alerts");
    return response.data;
  },

  getSeverityDistribution: async () => {
    const response = await api.get("/dashboard/severity");
    return response.data;
  },
};