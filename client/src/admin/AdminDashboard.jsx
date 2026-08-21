import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
         const response = await fetch(
  "http://localhost:5000/api/admin/dashboard",
  {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }
);

const text = await response.text();

console.log("Status:", response.status);
console.log("Response:", text);

if (!response.ok) {
  throw new Error(`Dashboard request failed: ${response.status}`);
}

const data = JSON.parse(text);

setStats(data.stats);
setRecentOrders(data.recentOrders);
      } catch (error) {
        console.error("Dashboard error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f6f2]">
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f6f2]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f6f2]">

      {/* Navbar */}
      <nav className="border-b border-black/10 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          <Link
            to="/"
            className="text-2xl font-bold tracking-[0.2em]"
          >
            AI EYEWEAR
          </Link>

          <div className="flex items-center gap-6">

            <span className="text-sm font-medium">
              Admin Panel
            </span>

            <Link
              to="/"
              className="text-sm underline underline-offset-4"
            >
              View Store
            </Link>

          </div>

        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-12">

        {/* Header */}

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-black/40">
              Administration
            </p>

            <h1 className="mt-2 text-4xl font-semibold">
              Dashboard
            </h1>
          </div>

          <Link
            to="/admin/products"
            className="w-fit bg-black px-6 py-3 text-sm uppercase tracking-wider text-white transition hover:bg-black/80"
          >
            Manage Products
          </Link>

        </div>

        {/* Statistics */}

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            title="Total Users"
            value={stats.totalUsers}
          />

          <StatCard
            title="Total Products"
            value={stats.totalProducts}
          />

          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
          />

          <StatCard
            title="Total Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
          />

        </div>

        {/* Order Statistics */}

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            title="Pending Payments"
            value={stats.pendingPayments}
          />

          <StatCard
            title="Processing"
            value={stats.processingOrders}
          />

          <StatCard
            title="Shipped"
            value={stats.shippedOrders}
          />

          <StatCard
            title="Delivered"
            value={stats.deliveredOrders}
          />

        </div>

        {/* Recent Orders */}

        <section className="mt-12">

          <div className="flex items-center justify-between">

            <h2 className="text-2xl font-semibold">
              Recent Orders
            </h2>

            <Link
              to="/admin/orders"
              className="text-sm underline underline-offset-4"
            >
              View All Orders
            </Link>

          </div>

          <div className="mt-6 overflow-x-auto bg-white">

            {recentOrders.length === 0 ? (

              <div className="p-8 text-center text-black/50">
                No orders found.
              </div>

            ) : (

              <table className="w-full min-w-[700px]">

                <thead className="border-b border-black/10 text-left">

                  <tr>

                    <th className="px-6 py-4 text-xs uppercase tracking-wider text-black/40">
                      Order
                    </th>

                    <th className="px-6 py-4 text-xs uppercase tracking-wider text-black/40">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-xs uppercase tracking-wider text-black/40">
                      Amount
                    </th>

                    <th className="px-6 py-4 text-xs uppercase tracking-wider text-black/40">
                      Payment
                    </th>

                    <th className="px-6 py-4 text-xs uppercase tracking-wider text-black/40">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {recentOrders.map((order) => (

                    <tr
                      key={order._id}
                      className="border-b border-black/5 last:border-0"
                    >

                      <td className="px-6 py-5 text-sm">
                        #{order._id.slice(-8)}
                      </td>

                      <td className="px-6 py-5">

                        <p className="text-sm font-medium">
                          {order.user?.name || "Unknown"}
                        </p>

                        <p className="text-xs text-black/40">
                          {order.user?.email || ""}
                        </p>

                      </td>

                      <td className="px-6 py-5 text-sm font-medium">
                        ₹{order.totalAmount.toLocaleString()}
                      </td>

                      <td className="px-6 py-5">

                        <span
                          className={`text-xs uppercase tracking-wider ${
                            order.paymentStatus === "Paid"
                              ? "text-green-700"
                              : order.paymentStatus === "Failed"
                              ? "text-red-600"
                              : "text-yellow-700"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>

                      </td>

                      <td className="px-6 py-5">

                        <span className="bg-black px-3 py-2 text-xs uppercase tracking-wider text-white">
                          {order.orderStatus}
                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            )}

          </div>

        </section>

      </main>

    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-6">

      <p className="text-xs uppercase tracking-[0.2em] text-black/40">
        {title}
      </p>

      <p className="mt-4 text-3xl font-semibold">
        {value}
      </p>

    </div>
  );
}

export default AdminDashboard;