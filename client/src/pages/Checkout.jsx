import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart } from "../services/cartApi";
import { createOrder } from "../services/orderApi";

const loadRazorpay = () => {
  return new Promise((resolve) => {
    // If Razorpay is already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

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

  const [paymentMethod, setPaymentMethod] =
    useState("Razorpay");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const navigate = useNavigate();

  // ==============================
  // Fetch Cart
  // ==============================

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

  // ==============================
  // Form Change
  // ==============================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ==============================
  // Total
  // ==============================

  const total = cart.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  // ==============================
  // Place Order
  // ==============================

  
     const handlePlaceOrder = async (e) => {
  e.preventDefault();

  if (
    !form.name.trim() ||
    !form.phone.trim() ||
    !form.address.trim() ||
    !form.city.trim() ||
    !form.state.trim() ||
    !form.pincode.trim()
  ) {
    alert("Please provide complete shipping information");
    return;
  }

  try {
    const data = await createOrder({
      shippingAddress: {
        name: form.name,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      },
      paymentMethod,
    });

    if (!data.success) {
      alert(data.message || "Failed to create order");
      return;
    }

    // COD
    if (paymentMethod === "COD") {
      alert("Order placed successfully! 🎉");
      navigate("/orders");
      return;
    }

  

      // ==========================================
      // RAZORPAY
      // ==========================================

      const loaded = await loadRazorpay();

      if (!loaded) {
        alert(
          "Razorpay failed to load. Please check your internet connection."
        );
        return;
      }

      const options = {
        key: data.razorpayKeyId,

        amount: data.razorpayOrder.amount,

        currency: data.razorpayOrder.currency,

        name: "AI Eyewear",

        description: "Eyewear Purchase",

        order_id: data.razorpayOrder.id,

        // ========================================
        // Razorpay Successful Payment
        // ========================================

        handler: async function (response) {
          try {
            const paymentResponse = await fetch(
              "http://localhost:5000/api/orders/verify-payment",
              {
                method: "POST",

                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem(
                    "token"
                  )}`,
                },

                body: JSON.stringify({
                  razorpay_order_id:
                    response.razorpay_order_id,

                  razorpay_payment_id:
                    response.razorpay_payment_id,

                  razorpay_signature:
                    response.razorpay_signature,

                  orderId: data.order._id,
                }),
              }
            );

            const verificationData =
              await paymentResponse.json();

            console.log(
              "Payment verification response:",
              verificationData
            );

            if (!paymentResponse.ok) {
              alert(
                verificationData.message ||
                  "Payment verification failed"
              );

              return;
            }

            // Payment successfully verified
            alert("Payment successful! 🎉");

            navigate("/orders");

          } catch (error) {
            console.error(
              "Payment verification error:",
              error
            );

            alert("Payment verification failed.");
          }
        },

        // ========================================
        // Prefill Customer Information
        // ========================================

        prefill: {
          name: form.name,
          contact: form.phone,
        },

        // ========================================
        // Theme
        // ========================================

        theme: {
          color: "#000000",
        },
      };

      const paymentObject =
        new window.Razorpay(options);

      // Razorpay payment failure
      paymentObject.on(
        "payment.failed",
        function (response) {
          console.error(
            "Razorpay payment failed:",
            response.error
          );

          alert(
            response.error?.description ||
              "Payment failed. Please try again."
          );
        }
      );

      paymentObject.open();

    } catch (error) {
      console.error("Checkout error:", error);

      alert(
        error.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  // ==============================
  // Loading
  // ==============================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading checkout...</p>
      </div>
    );
  }

  // ==============================
  // Empty Cart
  // ==============================

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

  // ==============================
  // Checkout UI
  // ==============================

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

          {/* ==================================
              Delivery Information
          ================================== */}

          <form
            onSubmit={handlePlaceOrder}
            className="bg-white p-8"
          >

            <h2 className="text-xl font-semibold">
              Delivery Information
            </h2>

            {/* Name + Phone */}

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

            {/* Address */}

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

            {/* City / State / Pincode */}

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

            {/* ==================================
                PAYMENT METHOD
            ================================== */}

            <div className="mt-10">

              <h2 className="text-xl font-semibold">
                Payment Method
              </h2>

              <div className="mt-5 space-y-4">

                {/* Razorpay */}

                <label
                  className={`flex cursor-pointer items-start gap-4 border p-5 transition ${
                    paymentMethod === "Razorpay"
                      ? "border-black"
                      : "border-black/10"
                  }`}
                >

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Razorpay"
                    checked={
                      paymentMethod === "Razorpay"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                    className="mt-1"
                  />

                  <div>

                    <p className="font-medium">
                      Online Payment
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Pay securely using UPI, Card or
                      Net Banking
                    </p>

                  </div>

                </label>

                {/* COD */}

                <label
                  className={`flex cursor-pointer items-start gap-4 border p-5 transition ${
                    paymentMethod === "COD"
                      ? "border-black"
                      : "border-black/10"
                  }`}
                >

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={
                      paymentMethod === "COD"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                    className="mt-1"
                  />

                  <div>

                    <p className="font-medium">
                      Cash on Delivery
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Pay when your order is
                      delivered
                    </p>

                  </div>

                </label>

              </div>

            </div>

            {/* ==================================
                PLACE ORDER BUTTON
            ================================== */}

            <button
              type="submit"
              className="mt-8 w-full bg-black py-4 text-sm uppercase tracking-wider text-white transition hover:bg-black/80"
            >
              {paymentMethod === "COD"
                ? "Place COD Order"
                : "Continue to Payment"}
            </button>

          </form>

          {/* ==================================
              ORDER SUMMARY
          ================================== */}

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
                        item.product.price *
                        item.quantity
                      ).toLocaleString()}
                    </p>

                  </div>

                </div>

              ))}

            </div>

            <div className="mt-8 space-y-4 border-t border-black/10 pt-6">

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  ₹{total.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>

              <div className="flex justify-between border-t border-black/10 pt-4 text-xl font-semibold">
                <span>Total</span>
                <span>
                  ₹{total.toLocaleString()}
                </span>
              </div>

            </div>

            {/* Selected Payment Method */}

            <div className="mt-6 border-t border-black/10 pt-5">

              <p className="text-xs uppercase tracking-wider text-gray-400">
                Payment Method
              </p>

              <p className="mt-2 font-medium">
                {paymentMethod === "COD"
                  ? "Cash on Delivery"
                  : "Online Payment"}
              </p>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Checkout;
