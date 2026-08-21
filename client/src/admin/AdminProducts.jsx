import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/admin/products", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const contentType = response.headers.get("content-type");
if (!contentType || !contentType.includes("application/json")) {
  throw new Error(`Server returned non-JSON response (${response.status})`);
}

const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch products");
        }

        setProducts(data.products || []);
      } catch (error) {
        console.error("Products error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Handle product deletion
  const handleDelete = async (productId, productName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${productName}"?`
    );
    
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(
        `http://localhost:5000/api/admin/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete product");
      }

      // Proactively remove the deleted product from state to update UI
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId)
      );
      
      alert(data.message || "Product deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      alert(`Error deleting product: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-black/40">
            Administration
          </p>
          <h1 className="mt-2 text-3xl font-semibold">
            Products
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your eyewear products
          </p>
        </div>

        <Link
          to="/admin/products/add"
          className="w-fit bg-black px-6 py-3 text-sm uppercase tracking-wider text-white hover:bg-black/80"
        >
          + Add Product
        </Link>
      </div>

      {/* Product Table */}
      <div className="mt-8 overflow-x-auto bg-white">
        {products.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No products found.
          </div>
        ) : (
          <table className="w-full min-w-[900px]">
            <thead className="border-b border-black/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-black/40">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-black/40">
                  Brand
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-black/40">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-black/40">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-black/40">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-black/40">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="border-b border-black/5"
                >
                  {/* Product */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 bg-gray-50">
                        <img
                          src={product.images?.[0]}
                          alt={product.name}
                          className="h-full w-full object-contain p-2"
                        />
                      </div>
                      <div>
                        <p className="font-medium">
                          {product.name}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          ID: {product._id.slice(-8)}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Brand */}
                  <td className="px-6 py-5 text-sm">
                    {product.brand}
                  </td>

                  {/* Category */}
                  <td className="px-6 py-5 text-sm">
                    {product.category}
                  </td>

                  {/* Price */}
                  <td className="px-6 py-5 text-sm font-medium">
                    ₹{product.price?.toLocaleString()}
                  </td>

                  {/* Stock */}
                  <td className="px-6 py-5">
                    <span
                      className={`text-sm ${
                        product.stock > 0
                          ? "text-green-700"
                          : "text-red-600"
                      }`}
                    >
                      {product.stock > 0
                        ? product.stock
                        : "Out of stock"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-5">
                    <div className="flex gap-3">
                      <Link
                        to={`/admin/products/edit/${product._id}`}
                        className="border border-black px-4 py-2 text-xs uppercase tracking-wider hover:bg-black hover:text-white"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(product._id, product.name)}
                        className="border border-red-600 px-4 py-2 text-xs uppercase tracking-wider text-red-600 hover:bg-red-600 hover:text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminProducts;
