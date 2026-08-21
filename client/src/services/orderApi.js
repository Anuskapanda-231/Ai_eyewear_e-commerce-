const API_URL = "http://localhost:5000/api/orders";

const getToken = () => {
  return localStorage.getItem("token");
};

export const createOrder = async (orderData) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    "http://localhost:5000/api/orders",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    }
  );

  return await response.json();
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