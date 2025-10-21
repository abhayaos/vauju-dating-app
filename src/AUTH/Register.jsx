import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com|outlook\.com)$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!emailRegex.test(email)) {
      toast.error("Invalid email! Only Gmail, Hotmail, Outlook allowed.");
      return;
    }
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.post(
        "https://backend-vauju-1.onrender.com/api/auth/register",
        { username, name, email, password, captchaVerified: true }
      );
      setLoading(false);
      navigate("/login");
    } catch (error) {
      setErrors({ backend: error.response?.data?.message || "Registration failed!" });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100">
      <Toaster />
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 md:p-10">
        {/* Icon / hero */}
        <div className="flex justify-center mb-6">
          <div className="bg-pink-500 text-white w-16 h-16 flex items-center justify-center rounded-full text-3xl font-bold shadow-md">
            ❤️
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">Join AuraMeet</h2>
        <p className="text-center text-gray-500 mb-6">
          Find your perfect match today. Create your account!
        </p>

        {errors.backend && (
          <p className="text-red-600 text-center mb-4">{errors.backend}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          {[
            { label: "Name", value: name, setter: setName, type: "text" },
            { label: "Username", value: username, setter: setUsername, type: "text" },
            { label: "Email", value: email, setter: setEmail, type: "email" },
            { label: "Password", value: password, setter: setPassword, type: "password" },
            { label: "Confirm Password", value: confirmPassword, setter: setConfirmPassword, type: "password" },
          ].map((field, idx) => (
            <div key={idx}>
              <label className="block mb-1 font-medium text-gray-700">{field.label}</label>
              <input
                type={field.type}
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none text-gray-800"
                required
                autoComplete="off"
              />
              {field.label === "Confirm Password" && errors.confirmPassword && (
                <p className="text-red-600 mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 font-semibold rounded-xl transition disabled:opacity-50 mt-3"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-pink-500 font-semibold hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
