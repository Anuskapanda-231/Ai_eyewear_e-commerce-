const API_URL = "http://localhost:5000/api/orders";

const getToken = () => {
  return localStorage.getItem("token");
};

export const createOrder = async (shippingAddress) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      shippingAddress,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create order");
  }

  return data;
};

export const getMyOrders = async () => {
  const response = await fetch(`${API_URL}/my-orders`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch orders");
  }

  return data;
};