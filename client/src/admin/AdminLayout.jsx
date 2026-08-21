import { Link, Outlet, useNavigate } from "react-router-dom";

function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#f7f6f2]">

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-black/10 bg-white">

        <div className="border-b border-black/10 px-6 py-6">
          <Link
            to="/admin"
            className="text-xl font-bold tracking-[0.15em]"
          >
            AI EYEWEAR
          </Link>

          <p className="mt-1 text-xs uppercase tracking-wider text-gray-400">
            Admin Panel
          </p>
        </div>

        <nav className="px-4 py-6">

          <p className="px-3 text-xs uppercase tracking-wider text-gray-400">
            Management
          </p>

          <div className="mt-3 space-y-1">

            <Link
              to="/admin"
              className="block px-3 py-3 text-sm hover:bg-gray-100"
            >
              Dashboard
            </Link>

            <Link
              to="/admin/products"
              className="block px-3 py-3 text-sm hover:bg-gray-100"
            >
              Products
            </Link>

            <Link
              to="/admin/products/add"
              className="block px-3 py-3 text-sm hover:bg-gray-100"
            >
              Add Product
            </Link>

            <Link
              to="/admin/orders"
              className="block px-3 py-3 text-sm hover:bg-gray-100"
            >
              Orders
            </Link>

            <Link
              to="/admin/users"
              className="block px-3 py-3 text-sm hover:bg-gray-100"
            >
              Users
            </Link>

          </div>

          <div className="mt-8 border-t border-black/10 pt-6">

            <Link
              to="/"
              className="block px-3 py-3 text-sm text-gray-600 hover:bg-gray-100"
            >
              ← Back to Store
            </Link>

            <button
              onClick={handleLogout}
              className="mt-1 w-full px-3 py-3 text-left text-sm text-red-600 hover:bg-red-50"
            >
              Logout
            </button>

          </div>

        </nav>

      </aside>

      {/* Main Content */}
      <div className="ml-64 flex min-h-screen flex-1 flex-col">

        {/* Topbar */}
        <header className="flex h-20 items-center justify-between border-b border-black/10 bg-white px-8">

          <div>
            <h1 className="text-lg font-semibold">
              Admin Panel
            </h1>

            <p className="text-xs text-gray-400">
              Manage your AI Eyewear store
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm font-medium">
              Administrator
            </p>

            <p className="text-xs text-gray-400">
              Admin
            </p>
          </div>

        </header>

        {/* Page Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default AdminLayout;