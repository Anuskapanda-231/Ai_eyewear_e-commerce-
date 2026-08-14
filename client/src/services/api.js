const API_URL = "http://localhost:5000/api";

const api = {
  getProducts: async (params = {}) => {
    const query = new URLSearchParams(params).toString();

    const response = await fetch(
      `${API_URL}/products${query ? `?${query}` : ""}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch products");
    }

    return data;
  },

  getProductById: async (id) => {
    const response = await fetch(`${API_URL}/products/${id}`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch product");
    }

    return data;
  },
};

export default api;