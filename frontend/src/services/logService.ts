import api from './api';

export const logService = {
  uploadFile: async (file: File, onProgress?: (percent: number) => void) => {
    const formData = new FormData();
    formData.append('logfile', file);

    const response = await api.post('/logs/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });
    return response.data;
  },

  getLogs: async () => {
    const response = await api.get('/logs');
    return response.data;
  },
};
