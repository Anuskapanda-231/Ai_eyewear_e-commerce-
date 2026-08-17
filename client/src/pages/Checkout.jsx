import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart } from "../services/cartApi";
import { createOrder } from "../services/orderApi";

const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      resolve(false);
    };

    document.body.appendChild(script);
  });
};
function Checkout() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

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

        if (data.success) {
          setCart(data.cart);
        }
      } catch (error) {
        console.error("Checkout cart error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const total = cart.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

const handlePlaceOrder = async (e) => {
  e.preventDefault();

  try {
    const loaded = await loadRazorpay();

    if (!loaded) {
      alert("Razorpay failed to load. Please check your internet connection.");
      return;
    }

    // Create order in our backend
    const data = await createOrder(form);

    if (!data.success) {
      alert(data.message);
      return;
    }

    const options = {
      key: data.razorpayKeyId,

      amount: data.razorpayOrder.amount,

      currency: data.razorpayOrder.currency,

      name: "AI Eyewear",

      description: "Eyewear Purchase",

      order_id: data.razorpayOrder.id,

      handler: async function (response) {
        try {
          const paymentResponse = await fetch(
            "http://localhost:5000/api/orders/verify-payment",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: data.order._id,
              }),
            }
          );

          const verificationData = await paymentResponse.json();

console.log("Payment verification response:", verificationData);

if (!paymentResponse.ok) {
  alert(
    verificationData.message ||
    "Payment verification failed"
  );
  return;
}

          alert("Payment successful! 🎉");

          navigate("/orders");

        } catch (error) {
          console.error("Payment verification error:", error);
          alert("Payment verification failed.");
        }
      },

      prefill: {
        name: form.name,
        contact: form.phone,
      },

      theme: {
        color: "#000000",
      },
    };

    const paymentObject = new window.Razorpay(options);

    paymentObject.open();

  } catch (error) {
    console.error("Checkout error:", error);
    alert(error.message || "Something went wrong.");
  }
};
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading checkout...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold">
          Your cart is empty
        </h1>

        <Link
          to="/products"
          className="mt-6 bg-black px-6 py-3 text-white"
        >
          Continue Shopping
        </Link>
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
            to="/cart"
            className="text-sm underline underline-offset-4"
          >
            ← Back to Cart
          </Link>

        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-12">

        <h1 className="text-4xl font-semibold">
          Checkout
        </h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px]">

          {/* Customer Information */}

          <form
            onSubmit={handlePlaceOrder}
            className="bg-white p-8"
          >

            <h2 className="text-xl font-semibold">
              Delivery Information
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-2">

              <div>
                <label className="text-sm">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full border border-black/20 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="text-sm">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full border border-black/20 px-4 py-3 outline-none focus:border-black"
                />
              </div>

            </div>

            <div className="mt-5">

              <label className="text-sm">
                Address
              </label>

              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                rows="4"
                className="mt-2 w-full resize-none border border-black/20 px-4 py-3 outline-none focus:border-black"
              />

            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-3">

              <div>
                <label className="text-sm">
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full border border-black/20 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="text-sm">
                  State
                </label>

                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full border border-black/20 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="text-sm">
                  Pincode
                </label>

                <input
                  type="text"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full border border-black/20 px-4 py-3 outline-none focus:border-black"
                />
              </div>

            </div>

            <button
              type="submit"
              className="mt-8 w-full bg-black py-4 text-sm uppercase tracking-wider text-white transition hover:bg-black/80"
            >
              Continue to Payment
            </button>

          </form>

          {/* Order Summary */}

          <div className="h-fit bg-white p-8">

            <h2 className="text-xl font-semibold">
              Order Summary
            </h2>

            <div className="mt-6 space-y-5">

              {cart.map((item) => (
                <div
                  key={item.product._id}
                  className="flex gap-4"
                >

                  <div className="h-20 w-20 shrink-0 bg-gray-50">
                    <img
                      src={item.product.images?.[0]}
                      alt={item.product.name}
                      className="h-full w-full object-contain p-2"
                    />
                  </div>

                  <div className="flex-1">

                    <p className="font-medium">
                      {item.product.name}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>

                    <p className="mt-1">
                      ₹
                      {(
                        item.product.price * item.quantity
                      ).toLocaleString()}
                    </p>

                  </div>

                </div>
              ))}

            </div>

            <div className="mt-8 space-y-4 border-t border-black/10 pt-6">

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{total.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>

              <div className="flex justify-between border-t border-black/10 pt-4 text-xl font-semibold">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Checkout;
