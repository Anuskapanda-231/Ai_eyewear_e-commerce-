const API_URL = "http://localhost:5000/api/cart";

// Get token
const getToken = () => {
  return localStorage.getItem("token");
};

// Add product to cart
export const addToCart = async (productId, quantity = 1) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      productId,
      quantity,
    }),
  });

  return response.json();
};

// Get cart
export const getCart = async () => {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.json();
};

// Update quantity
export const updateCart = async (productId, quantity) => {
  const response = await fetch(API_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      productId,
      quantity,
    }),
  });

  return response.json();
};

// Remove product
export const removeFromCart = async (productId) => {
  const response = await fetch(`${API_URL}/${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.json();
};