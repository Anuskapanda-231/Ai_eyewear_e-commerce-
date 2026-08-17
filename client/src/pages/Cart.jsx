import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  getCart,
  updateCart,
  removeFromCart,
} from "../services/cartApi";

function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const data = await getCart();

        console.log("CART DATA:", data);

        if (data.success) {
          setCart(data.cart);
        }
      } catch (error) {
        console.error("Cart error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  const handleQuantityChange = async (productId, quantity) => {
    if (quantity < 1) return;

    try {
      const data = await updateCart(productId, quantity);

      if (data.success) {
        setCart(data.cart);
      }
    } catch (error) {
      console.error("Update cart error:", error);
    }
  };

  const handleRemove = async (productId) => {
    try {
      const data = await removeFromCart(productId);

      if (data.success) {
        setCart(data.cart);
      }
    } catch (error) {
      console.error("Remove cart error:", error);
    }
  };

  const total = cart.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h1>Loading cart...</h1>
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
          Shopping Cart
        </h1>

        {cart.length === 0 ? (

          <div className="mt-16 text-center">

            <p className="text-xl">
              Your cart is empty.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-block bg-black px-6 py-3 text-sm uppercase tracking-wider text-white"
            >
              Shop Eyewear
            </Link>

          </div>

        ) : (

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_350px]">

            {/* Cart Items */}

            <div className="space-y-5">

              {cart.map((item) => {

                const product = item.product;

                return (
                  <div
                    key={product._id}
                    className="flex gap-6 bg-white p-5"
                  >

                    <Link
                      to={`/products/${product._id}`}
                      className="h-32 w-32 shrink-0 bg-gray-50"
                    >
                      <img
                        src={product.images?.[0]}
                        alt={product.name}
                        className="h-full w-full object-contain p-3"
                      />
                    </Link>

                    <div className="flex flex-1 flex-col justify-between">

                      <div>

                        <p className="text-xs uppercase tracking-wider text-gray-400">
                          {product.brand}
                        </p>

                        <h2 className="mt-1 text-lg font-medium">
                          {product.name}
                        </h2>

                        <p className="mt-2">
                          ₹{product.price}
                        </p>

                      </div>

                      <div className="flex items-center justify-between">

                        {/* Quantity */}

                        <div className="flex items-center border border-black/20">

                          <button
                            onClick={() =>
                              handleQuantityChange(
                                product._id,
                                item.quantity - 1
                              )
                            }
                            className="px-4 py-2"
                          >
                            −
                          </button>

                          <span className="px-4">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              handleQuantityChange(
                                product._id,
                                item.quantity + 1
                              )
                            }
                            className="px-4 py-2"
                          >
                            +
                          </button>

                        </div>

                        <button
                          onClick={() =>
                            handleRemove(product._id)
                          }
                          className="text-sm text-red-600"
                        >
                          Remove
                        </button>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>

            {/* Summary */}

            <div className="h-fit bg-white p-6">

              <h2 className="text-xl font-semibold">
                Order Summary
              </h2>

              <div className="mt-6 flex justify-between border-b border-black/10 pb-4">
                <span>Subtotal</span>
                <span>₹{total.toLocaleString()}</span>
              </div>

              <div className="mt-4 flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>

              <div className="mt-6 flex justify-between text-xl font-semibold">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>

              <Link
                to="/checkout"
                className="mt-8 block bg-black py-4 text-center text-sm uppercase tracking-wider text-white"
              >
                Proceed to Checkout
              </Link>

            </div>

          </div>

        )}

      </main>

    </div>
  );
}

export default Cart;