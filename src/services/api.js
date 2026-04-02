const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api"; // Importante colocar la url de tu api

export const api = {
  get: async (endpoint) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error en GET:", error);
      throw error;
    }
  },

  post: async (endpoint, body) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Authorization': token? `Bearer ${token}`: '', 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error en POST:", error);
      throw error;
    }
  }
}; 
