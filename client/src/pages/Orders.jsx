import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyOrders } from "../services/orderApi";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const data = await getMyOrders();

        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error("Orders error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
      const data = await getMyOrders();

console.log("Orders received:", data.orders);
console.log(
  "Order IDs:",
  data.orders.map((order) => order._id)
);

if (data.success) {
  setOrders(data.orders);
}
    };

    fetchOrders();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f6f2]">

      {/* Navbar */}
      <nav className="border-b border-black/10">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          <Link
            to="/"
            className="text-2xl font-bold tracking-[0.2em]"
          >
            AI EYEWEAR
          </Link>

          <Link
            to="/products"
            className="text-sm underline underline-offset-4"
          >
            Continue Shopping
          </Link>

        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-12">

        <h1 className="text-4xl font-semibold">
          My Orders
        </h1>

        {orders.length === 0 ? (

          <div className="mt-16 text-center">

            <p className="text-xl">
              You haven't placed any orders yet.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-block bg-black px-6 py-3 text-sm uppercase tracking-wider text-white"
            >
              Shop Eyewear
            </Link>

          </div>

        ) : (

          <div className="mt-10 space-y-8">

            {orders.map((order) => (

              <div
                key={order._id}
                className="bg-white p-6"
              >

                {/* Order Header */}

                <div className="flex flex-col justify-between gap-4 border-b border-black/10 pb-5 md:flex-row">

                  <div>

                    <p className="text-xs uppercase tracking-wider text-black/40">
                      Order ID
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      #{order._id}
                    </p>

                    <p className="mt-2 text-sm text-black/50">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>

                  </div>

                  <div className="flex gap-3">

                    <span className="h-fit bg-black px-4 py-2 text-xs uppercase tracking-wider text-white">
                      {order.orderStatus}
                    </span>

                    <span className="h-fit border border-black px-4 py-2 text-xs uppercase tracking-wider">
                      Payment: {order.paymentStatus}
                    </span>

                  </div>

                </div>

                {/* Products */}

                <div className="mt-6 space-y-5">

                  {order.items.map((item, index) => (

                    <div
                      key={item.product?._id || index}
                      className="flex gap-5"
                    >

                      <div className="h-24 w-24 shrink-0 bg-gray-50">

                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-contain p-2"
                        />

                      </div>

                      <div className="flex-1">

                        <h3 className="font-medium">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-sm text-black/50">
                          Quantity: {item.quantity}
                        </p>

                        <p className="mt-1">
                          ₹{item.price.toLocaleString()}
                        </p>

                      </div>

                    </div>

                  ))}

                </div>

                {/* Shipping Address */}

                <div className="mt-6 border-t border-black/10 pt-6">

                  <h3 className="font-medium">
                    Delivery Address
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-black/60">
                    {order.shippingAddress.name}
                    <br />
                    {order.shippingAddress.address}
                    <br />
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.state} -{" "}
                    {order.shippingAddress.pincode}
                    <br />
                    Phone: {order.shippingAddress.phone}
                  </p>

                </div>

                {/* Total */}

                <div className="mt-6 flex justify-between border-t border-black/10 pt-6 text-xl font-semibold">

                  <span>
                    Total
                  </span>

                  <span>
                    ₹{order.totalAmount.toLocaleString()}
                  </span>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}

export default Orders;