import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const BASE_URL = "https://backend-vauju-1.onrender.com";

function EditProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    name: "",
    bio: "",
    age: "",
    gender: "other",
    interests: "",
    location: "",
    profilePic: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("token"));
    if (!user || !user._id) return navigate("/login");

    fetch(`${BASE_URL}/api/profile`, { headers: { "x-user-id": user._id } })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) =>
        setForm({
          username: data.username || "",
          name: data.name || "",
          bio: data.bio || "",
          age: data.age || "",
          gender: data.gender || "other",
          interests: (data.interests && data.interests.join(", ")) || "",
          location: data.location || "",
          profilePic:
            data.profilePic ||
            "https://cdn-icons-png.flaticon.com/512/847/847969.png",
        })
      )
      .catch((err) => toast.error("Failed to load profile: " + err.message));
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("token"));
    if (!user || !user._id) return;

    if (Number(form.age) < 13) {
      toast.error("You must be at least 13 years old.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user._id,
        },
        body: JSON.stringify({
          ...form,
          interests: form.interests
            .split(",")
            .map((i) => i.trim())
            .filter(Boolean),
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Update failed");

      localStorage.setItem("token", JSON.stringify({ ...user, ...result }));
      window.dispatchEvent(new Event("authChange"));
      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <Toaster position="top-center" />
      <div className="w-full max-w-md">
        {/* Header */}
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">
          Edit Profile
        </h2>

        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={form.profilePic}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="Username"
              required
            />
          </div>

          {/* Name */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="Full name"
            />
          </div>

          {/* Bio */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm h-20 resize-none focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="Tell something about yourself"
            />
          </div>

          {/* Age & Gender */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                name="age"
                type="number"
                value={form.age}
                onChange={handleChange}
                min="13"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                placeholder="Age (13+)"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Interests */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Interests
            </label>
            <input
              name="interests"
              value={form.interests}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="Interests (comma separated)"
            />
          </div>

          {/* Location */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="Location"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-2 rounded-full text-sm font-medium text-white transition ${
                loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="flex-1 py-2 rounded-full text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;