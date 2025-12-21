const API_BASE_URL = 'http://localhost:8001';

export const newsApi = {
  // Get medical news
  getMedicalNews: async (daysBack = 7, refresh = false) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/news/medical?days_back=${daysBack}&refresh=${refresh}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching medical news:', error);
      throw error;
    }
  },

  // Force refresh news
  refreshNews: async (daysBack = 7) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/news/refresh?days_back=${daysBack}`,
        { method: 'POST' }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error refreshing news:', error);
      throw error;
    }
  },

  // Health check
  checkHealth: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking health:', error);
      throw error;
    }
  }
};