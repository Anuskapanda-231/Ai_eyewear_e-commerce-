const API_URL = "http://localhost:5000/api/wishlist";

const getToken = () => {
  return localStorage.getItem("token");
};

export const getWishlist = async () => {
  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.json();
};

export const addToWishlist = async (productId) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ productId }),
  });

  return response.json();
};

export const removeFromWishlist = async (productId) => {
  const response = await fetch(`${API_URL}/${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.json();
};