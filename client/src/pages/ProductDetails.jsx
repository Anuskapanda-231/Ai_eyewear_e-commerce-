import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const data = await api.getProductById(id);

        setProduct(data.product);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading product...</p>
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

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Product not found.</p>
      </div>
    );
  }

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

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
            ← Back to Products
          </Link>

        </div>
      </nav>


      {/* Product */}
      <main className="mx-auto max-w-7xl px-6 py-12">

        <div className="grid gap-12 md:grid-cols-2">

          {/* Images */}
          <div>

            <div className="aspect-square overflow-hidden bg-white">

              <img
                src={product.images?.[selectedImage]}
                alt={product.name}
                className="h-full w-full object-contain p-8"
              />

            </div>


            {/* Image thumbnails */}
            {product.images?.length > 1 && (
              <div className="mt-4 flex gap-4">

                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`h-20 w-20 overflow-hidden border ${
                      selectedImage === index
                        ? "border-black"
                        : "border-black/10"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="h-full w-full object-contain"
                    />
                  </button>
                ))}

              </div>
            )}

          </div>


          {/* Information */}
          <div className="flex flex-col justify-center">

            <p className="text-xs uppercase tracking-[0.3em] text-black/40">
              {product.brand}
            </p>

            <h1 className="mt-4 text-4xl font-semibold md:text-5xl">
              {product.name}
            </h1>


            {/* Rating */}
            <div className="mt-5 flex items-center gap-3">

              <span>
                ⭐ {product.rating || 0}
              </span>

              <span className="text-sm text-black/40">
                ({product.numReviews || 0} reviews)
              </span>

            </div>


            {/* Price */}
            <div className="mt-8 flex items-center gap-4">

              <span className="text-2xl font-medium">
                ₹{product.price}
              </span>

              {product.discountPrice > 0 && (
                <span className="text-lg text-black/40 line-through">
                  ₹{product.discountPrice}
                </span>
              )}

            </div>


            {/* Description */}
            <p className="mt-8 max-w-lg leading-7 text-black/60">
              {product.description}
            </p>


            {/* Product specifications */}
            <div className="mt-8 grid grid-cols-2 gap-y-4 border-y border-black/10 py-6">

              <div>
                <p className="text-xs uppercase tracking-wider text-black/40">
                  Frame Shape
                </p>
                <p className="mt-1">
                  {product.frameShape || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-black/40">
                  Frame Type
                </p>
                <p className="mt-1">
                  {product.frameType || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-black/40">
                  Lens Type
                </p>
                <p className="mt-1">
                  {product.lensType || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-black/40">
                  Color
                </p>
                <p className="mt-1">
                  {product.color || "N/A"}
                </p>
              </div>

            </div>


            {/* Stock */}
            <div className="mt-6">

              {product.stock > 0 ? (
                <p className="text-sm text-green-700">
                  In stock — {product.stock} available
                </p>
              ) : (
                <p className="text-sm text-red-600">
                  Out of stock
                </p>
              )}

            </div>


            {/* Quantity */}
            {product.stock > 0 && (
              <div className="mt-6 flex items-center gap-5">

                <span className="text-sm">
                  Quantity
                </span>

                <div className="flex items-center border border-black/20">

                  <button
                    onClick={decreaseQuantity}
                    className="px-4 py-3"
                  >
                    −
                  </button>

                  <span className="min-w-10 text-center">
                    {quantity}
                  </span>

                  <button
                    onClick={increaseQuantity}
                    className="px-4 py-3"
                  >
                    +
                  </button>

                </div>

              </div>
            )}


            {/* Buttons */}
            <div className="mt-8 flex gap-4">

              <button
                disabled={product.stock === 0}
                className="flex-1 bg-black px-6 py-4 text-sm font-medium uppercase tracking-wider text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                Add to Cart
              </button>

              <button
                className="border border-black px-6 py-4 text-xl transition hover:bg-black hover:text-white"
                title="Add to Wishlist"
              >
                ♡
              </button>

            </div>


            {/* AI feature */}
            <div className="mt-8 bg-[#e7e4dc] p-6">

              <p className="text-xs uppercase tracking-[0.3em] text-black/40">
                AI Eyewear
              </p>

              <h3 className="mt-3 text-lg font-medium">
                Not sure if this frame suits you?
              </h3>

              <p className="mt-2 text-sm leading-6 text-black/50">
                Use our AI-powered virtual try-on to see
                how this frame looks on you.
              </p>

              <button className="mt-5 border border-black px-5 py-3 text-xs uppercase tracking-wider">
                Try Virtual Try-On
              </button>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default ProductDetails;