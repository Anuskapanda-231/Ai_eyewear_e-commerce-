import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getWishlist,
  removeFromWishlist,
} from "../services/wishlistApi";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const data = await getWishlist();

        console.log("WISHLIST DATA:", data);

        if (data.success) {
          setWishlist(data.wishlist);
        }
      } catch (error) {
        console.error("Wishlist error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [navigate]);

  const handleRemove = async (productId) => {
    try {
      const data = await removeFromWishlist(productId);

      if (data.success) {
        setWishlist((currentWishlist) =>
          currentWishlist.filter(
            (product) => product._id !== productId
          )
        );
      }
    } catch (error) {
      console.error("Remove wishlist error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h1>Loading wishlist...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f6f2]">

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
            ← Continue Shopping
          </Link>

        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-12">

        <h1 className="text-4xl font-semibold">
          My Wishlist
        </h1>

        {wishlist.length === 0 ? (

          <div className="mt-16 text-center">

            <p className="text-xl">
              Your wishlist is empty.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-block bg-black px-6 py-3 text-sm uppercase tracking-wider text-white"
            >
              Explore Eyewear
            </Link>

          </div>

        ) : (

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {wishlist.map((product) => (

              <div
                key={product._id}
                className="bg-white"
              >

                <Link to={`/products/${product._id}`}>

                  <div className="aspect-square overflow-hidden">

                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      className="h-full w-full object-contain p-6 transition duration-300 hover:scale-105"
                    />

                  </div>

                </Link>

                <div className="p-5">

                  <p className="text-xs uppercase tracking-wider text-gray-400">
                    {product.brand}
                  </p>

                  <h2 className="mt-2 font-medium">
                    {product.name}
                  </h2>

                  <p className="mt-3 text-lg">
                    ₹{product.price}
                  </p>

                  <div className="mt-5 flex gap-2">

                    <Link
                      to={`/products/${product._id}`}
                      className="flex-1 bg-black py-3 text-center text-xs uppercase tracking-wider text-white"
                    >
                      View Product
                    </Link>

                    <button
                      onClick={() => handleRemove(product._id)}
                      className="border border-black px-4 py-3"
                    >
                      ♡
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}

export default Wishlist;