import { useEffect, useState } from "react";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  const token = localStorage.getItem("token");

  // =====================================================
  // FETCH ALL ORDERS
  // =====================================================

  
  useEffect(() => {
    const fetchOrders = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/orders",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch orders");
      }

      setOrders(data.orders || []);
    } catch (error) {
      console.error("Admin orders error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

    fetchOrders();
  }, []);

  // =====================================================
  // UPDATE ORDER STATUS
  // =====================================================

  const updateStatus = async (orderId, status) => {
    try {
      setUpdating(true);

      const response = await fetch(
        `http://localhost:5000/api/admin/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update order status"
        );
      }

      // Update order in frontend
      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === orderId ? data.order : order
        )
      );

      // Update selected order if currently open
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(data.order);
      }

      alert("Order status updated successfully");
    } catch (error) {
      console.error("Update status error:", error);
      alert(error.message);
    } finally {
      setUpdating(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p>Loading orders...</p>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="bg-red-50 p-6 text-red-600">
        {error}
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-black/40">
          Administration
        </p>

        <h1 className="mt-2 text-3xl font-semibold">
          Orders
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage customer orders and delivery status
        </p>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white">
        {orders.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No orders found.
          </div>
        ) : (
          <table className="w-full min-w-[900px]">
            <thead className="border-b border-black/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-black/40">
                  Order
                </th>

                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-black/40">
                  Customer
                </th>

                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-black/40">
                  Amount
                </th>

                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-black/40">
                  Payment
                </th>

                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-black/40">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-black/40">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-black/5"
                >
                  {/* Order */}
                  <td className="px-6 py-5">
                    <p className="font-medium">
                      #{order._id.slice(-8)}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </td>

                  {/* Customer */}
                  <td className="px-6 py-5">
                    <p className="text-sm font-medium">
                      {order.user?.name || "Unknown"}
                    </p>

                    <p className="text-xs text-gray-400">
                      {order.user?.email || ""}
                    </p>
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-5 text-sm font-medium">
                    ₹{order.totalAmount?.toLocaleString()}
                  </td>

                  {/* Payment */}
                  <td className="px-6 py-5">
                    <p className="text-sm">
                      {order.paymentMethod}
                    </p>

                    <p
                      className={`text-xs ${
                        order.paymentStatus === "Paid"
                          ? "text-green-600"
                          : "text-orange-600"
                      }`}
                    >
                      {order.paymentStatus}
                    </p>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-5">
                    <span className="text-sm font-medium">
                      {order.orderStatus}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-5">
                    <button
                      onClick={() =>
                        setSelectedOrder(order)
                      }
                      className="border border-black px-4 py-2 text-xs uppercase tracking-wider hover:bg-black hover:text-white"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* =====================================================
          ORDER DETAILS MODAL
      ===================================================== */}

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto bg-white p-8">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b pb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-black/40">
                  Order Details
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  #{selectedOrder._id.slice(-8)}
                </h2>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="text-2xl text-gray-500 hover:text-black"
              >
                ×
              </button>
            </div>

            {/* Customer */}
            <div className="mt-6">
              <h3 className="font-semibold">
                Customer
              </h3>

              <p className="mt-2 text-sm">
                {selectedOrder.user?.name}
              </p>

              <p className="text-sm text-gray-500">
                {selectedOrder.user?.email}
              </p>
            </div>

            {/* Shipping */}
            <div className="mt-6">
              <h3 className="font-semibold">
                Shipping Address
              </h3>

              <div className="mt-2 text-sm text-gray-600">
                <p>
                  {selectedOrder.shippingAddress?.name}
                </p>

                <p>
                  {selectedOrder.shippingAddress?.phone}
                </p>

                <p>
                  {selectedOrder.shippingAddress?.address}
                </p>

                <p>
                  {selectedOrder.shippingAddress?.city},{" "}
                  {selectedOrder.shippingAddress?.state}
                </p>

                <p>
                  {selectedOrder.shippingAddress?.pincode}
                </p>
              </div>
            </div>

            {/* Products */}
            <div className="mt-6">
              <h3 className="font-semibold">
                Products
              </h3>

              <div className="mt-3 space-y-3">
                {selectedOrder.items?.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 border-b pb-3"
                  >
                    <img
                      src={
                        item.image ||
                        item.product?.images?.[0]
                      }
                      alt={item.name}
                      className="h-16 w-16 object-contain"
                    />

                    <div className="flex-1">
                      <p className="font-medium">
                        {item.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        ₹{item.price} × {item.quantity}
                      </p>
                    </div>

                    <p className="font-medium">
                      ₹
                      {(
                        item.price * item.quantity
                      ).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment */}
            <div className="mt-6 border-t pt-5">
              <div className="flex justify-between">
                <span>Payment Method</span>
                <strong>
                  {selectedOrder.paymentMethod}
                </strong>
              </div>

              <div className="mt-2 flex justify-between">
                <span>Payment Status</span>
                <strong>
                  {selectedOrder.paymentStatus}
                </strong>
              </div>

              <div className="mt-2 flex justify-between text-lg">
                <span>Total</span>
                <strong>
                  ₹
                  {selectedOrder.totalAmount?.toLocaleString()}
                </strong>
              </div>
            </div>

            {/* =================================================
                UPDATE STATUS
            ================================================= */}

            <div className="mt-8 border-t pt-6">
              <h3 className="font-semibold">
                Update Order Status
              </h3>

              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  "Confirmed",
                  "Processing",
                  "Packed",
                  "Shipped",
                  "Out for Delivery",
                  "Delivered",
                  "Cancelled",
                ].map((status) => (
                  <button
                    key={status}
                    disabled={
                      updating ||
                      selectedOrder.orderStatus === status
                    }
                    onClick={() =>
                      updateStatus(
                        selectedOrder._id,
                        status
                      )
                    }
                    className={`border px-4 py-2 text-xs uppercase tracking-wider ${
                      selectedOrder.orderStatus === status
                        ? "bg-black text-white"
                        : "border-black hover:bg-black hover:text-white"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* =================================================
                TRACKING TIMELINE
            ================================================= */}

            <div className="mt-8 border-t pt-6">
              <h3 className="font-semibold">
                Tracking Timeline
              </h3>

              <div className="mt-5 space-y-5">
                {selectedOrder.trackingTimeline
                  ?.slice()
                  .reverse()
                  .map((event, index) => (
                    <div
                      key={index}
                      className="flex gap-4"
                    >
                      <div className="mt-1 h-3 w-3 rounded-full bg-black" />

                      <div>
                        <p className="font-medium">
                          {event.status}
                        </p>

                        <p className="text-sm text-gray-500">
                          {event.message}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {new Date(
                            event.date
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;