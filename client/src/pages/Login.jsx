import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Save JWT
      // Save JWT
localStorage.setItem("token", data.token);

// Save user information
localStorage.setItem("user", JSON.stringify(data.user));

console.log("Login successful:", data);
console.log("User role:", data.user.role);

// Redirect based on role
if (data.user.role === "admin") {
  navigate("/admin");
} else {
  navigate("/");
}
    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f6f2] px-6">

      <div className="w-full max-w-md bg-white p-8 shadow-sm">

        <h1 className="text-3xl font-semibold">
          Welcome Back
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Login to your AI Eyewear account
        </p>

        {error && (
          <div className="mt-5 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form
          onSubmit={handleLogin}
          className="mt-8 space-y-5"
        >

          <div>
            <label className="text-sm">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full border border-gray-200 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="text-sm">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full border border-gray-200 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black py-3 text-sm font-medium uppercase tracking-wider text-white disabled:bg-gray-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;