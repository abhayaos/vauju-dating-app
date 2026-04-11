import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirm) {
      setError("All fields are required");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: name,
          email,
          password,
          confirmPassword: confirm,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // auto login after signup
      login({
        name: data.user.fullName,
        email: data.user.email,
        token: data.token,
      });

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">

      <div className="w-full max-w-5xl flex flex-col md:flex-row shadow-2xl rounded-3xl overflow-hidden border">

        {/* LEFT PANEL */}
        <div className="md:w-1/2 bg-black text-white p-10 flex flex-col justify-center">
          <h1 className="text-4xl font-bold">
            Start your journey 🚀
          </h1>

          <p className="text-gray-300 mt-4">
            Join and build something amazing with us.
          </p>

          <div className="mt-8 space-y-4">
            <div className="bg-white/10 p-4 rounded-xl">
              ⚡ Fast onboarding
            </div>
            <div className="bg-white/10 p-4 rounded-xl">
              🔐 Secure authentication
            </div>
            <div className="bg-white/10 p-4 rounded-xl">
              📱 Responsive UI
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="md:w-1/2 p-10 bg-white">

          <h2 className="text-2xl font-bold">Create account</h2>
          <p className="text-gray-500 text-sm mt-1">
            Fill your details
          </p>

          <form onSubmit={handleSignup} className="mt-8 space-y-5">

            {/* NAME + EMAIL */}
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:border-black outline-none"
              />

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:border-black outline-none"
              />
            </div>

            {/* PASSWORD */}
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:border-black outline-none"
              />

              <input
                type={showPass ? "text" : "password"}
                placeholder="Confirm password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:border-black outline-none"
              />
            </div>

            {/* TOGGLE + ERROR */}
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  onChange={() => setShowPass(!showPass)}
                />
                Show password
              </label>

              {error && (
                <span className="text-red-500 text-sm">{error}</span>
              )}
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-black text-white rounded-xl font-semibold hover:scale-[1.02] active:scale-95 transition"
            >
              {loading ? "Creating..." : "Create account"}
            </button>

            {/* LOGIN LINK */}
            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-black font-medium cursor-pointer hover:underline"
              >
                Login
              </span>
            </p>

          </form>
        </div>

      </div>
    </div>
  );
};

export default Signup;