import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useAdminAuth } from "../../context/AdminAuthContext";

function AdminLogin() {
  const navigate = useNavigate();
  const { adminToken, loginAdmin, isAdminLoggedIn } = useAdminAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = "https://backend-vauju-1.onrender.com";

  useEffect(() => {
    if (isAdminLoggedIn) {
      navigate("/admin");
    }
  }, [isAdminLoggedIn, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    if (!trimmedUsername || !trimmedPassword) {
      toast.error("Username and password are required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: trimmedUsername, password: trimmedPassword }),
      });

      let data = null;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      }

      if (!res.ok) {
        const message = data?.message || `Login failed (status ${res.status})`;
        throw new Error(message);
      }

      if (!data?.token) {
        throw new Error("Login failed: token missing");
      }

      loginAdmin(data.token, data.admin);
      toast.success("Login successful 🎉");
      setTimeout(() => navigate("/admin"), 500);
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.message || "Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-sm mx-auto mt-20 border rounded-xl shadow-md">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4 text-center">Admin Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-2 rounded cursor-pointer ${
            loading && "opacity-70"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-500 text-center">
        Demo: username: <b>admin</b>, password: <b>admin123</b>
      </p>
    </div>
  );
}

export default AdminLogin;
