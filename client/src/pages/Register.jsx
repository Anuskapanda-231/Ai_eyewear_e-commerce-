import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccess("Registration successful! Redirecting to login...");

      setForm({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
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
            to="/login"
            className="text-sm underline underline-offset-4"
          >
            Login
          </Link>

        </div>
      </nav>

      {/* Register Form */}
      <main className="flex justify-center px-6 py-12">

        <div className="w-full max-w-lg bg-white p-8">

          <h1 className="text-3xl font-semibold">
            Create Account
          </h1>

          <p className="mt-2 text-sm text-black/50">
            Create your AI Eyewear account
          </p>

          {error && (
            <div className="mt-6 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-6 bg-green-50 p-4 text-sm text-green-700">
              {success}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            {/* Name */}
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
                placeholder="Enter your name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-2 w-full border border-black/20 px-4 py-3 outline-none focus:border-black"
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="mt-2 w-full border border-black/20 px-4 py-3 outline-none focus:border-black"
                placeholder="Create a password"
              />
            </div>

            {/* Phone */}
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
                placeholder="Enter your phone number"
              />
            </div>

            {/* Address */}
            <div>
              <label className="text-sm">
                Address
              </label>

              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                rows="3"
                className="mt-2 w-full resize-none border border-black/20 px-4 py-3 outline-none focus:border-black"
                placeholder="Enter your address"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black py-4 text-sm uppercase tracking-wider text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>

          <p className="mt-6 text-center text-sm text-black/50">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-black underline"
            >
              Login
            </Link>
          </p>

        </div>

      </main>

    </div>
  );
}

export default Register;