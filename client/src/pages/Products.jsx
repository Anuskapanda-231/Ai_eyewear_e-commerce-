import { Link } from "react-router-dom";
import useProducts from "../context/useProducts";

function Products() {
  const { products, loading, error } = useProducts();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading products...</p>
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
    <div className="min-h-screen bg-[#f7f6f2] px-6 py-12">
      <div className="mx-auto max-w-7xl">

        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
            AI Eyewear
          </p>

          <h1 className="mt-3 text-4xl font-semibold">
            All Frames
          </h1>

          <p className="mt-3 text-gray-500">
            {products.length} products available
          </p>
        </div>

        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">

            {products.map((product) => (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                className="group"
              >
                <div className="aspect-square overflow-hidden bg-white">

                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="h-full w-full object-contain p-5 transition duration-500 group-hover:scale-105"
                  />

                </div>

                <div className="mt-4">

                  <p className="text-xs uppercase tracking-wider text-gray-400">
                    {product.brand}
                  </p>

                  <h2 className="mt-1 font-medium">
                    {product.name}
                  </h2>

                  <div className="mt-2 flex items-center gap-3">

                    <span className="font-medium">
                      ₹{product.price}
                    </span>

                    {product.discountPrice > 0 && (
                      <span className="text-sm text-gray-400 line-through">
                        ₹{product.discountPrice}
                      </span>
                    )}

                  </div>

                </div>
              </Link>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default Products;