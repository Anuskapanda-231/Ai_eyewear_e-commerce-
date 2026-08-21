import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Products from "./pages/Products.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Orders from "./pages/Orders.jsx";

import AdminDashboard from "./admin/AdminDashboard.jsx";
import AdminLayout from "./admin/AdminLayout.jsx";
import AdminProducts from "./admin/AdminProducts.jsx";
import AdminAddProduct from "./admin/AdminAddProduct.jsx";
import AdminEditProduct from "./admin/AdminEditProduct.jsx";
import AdminOrders from "./admin/AdminOrders";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= USER ROUTES ================= */}

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/products" element={<Products />} />

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/wishlist"
          element={<Wishlist />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
          path="/orders"
          element={<Orders />}
        />


        {/* ================= ADMIN ROUTES ================= */}

        <Route path="/admin" element={<AdminLayout />}>

          {/* /admin → /admin/dashboard */}
          <Route
            index
            element={
              <Navigate
                to="dashboard"
                replace
              />
            }
          />

          {/* /admin/dashboard */}
          <Route
            path="dashboard"
            element={<AdminDashboard />}
          />
         <Route
    path="products"
    element={<AdminProducts />}
  />

    <Route
    path="products/add"
    element={<AdminAddProduct />}
  />

    <Route
    path="products/edit/:id"
    element={<AdminEditProduct />}
  />

  <Route
  path="/admin/orders"
  element={<AdminOrders />}
/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;