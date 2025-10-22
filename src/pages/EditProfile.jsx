import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

// Use environment variable for BASE_URL
const BASE_URL = import.meta.env.VITE_API_URL || "https://backend-vauju-1.onrender.com";

// Utility function to decode JWT and get userId
const getUserIdFromToken = (token) => {
  try {
    const payload = jwtDecode(token); // Use named export
    return payload._id || payload.id || payload.sub;
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
};

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

  // Load user profile on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to continue");
      return navigate("/login");
    }

    const userId = getUserIdFromToken(token);
    if (!userId) {
      toast.error("Invalid session. Please log in again.");
      return navigate("/login");
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`, // Use standard Authorization header
          },
        });
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Failed to fetch profile");
        }
        const data = await res.json();
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
        });
      } catch (err) {
        toast.error(`Failed to load profile: ${err.message}`);
        if (err.message.includes("Unauthorized")) {
          navigate("/login");
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile image upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("Image size must be less than 5MB");
      return;
    }

    // Instant preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, profilePic: reader.result }));
    };
    reader.readAsDataURL(file);

    // Upload to backend
    try {
      const token = localStorage.getItem("token");
      const userId = getUserIdFromToken(token);
      if (!userId) {
        toast.error("Invalid session. Please log in again.");
        return navigate("/login");
      }

      const formData = new FormData();
      formData.append("profilePic", file);

      const res = await fetch(`${BASE_URL}/api/profile/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Use standard Authorization header
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      setForm((prev) => ({ ...prev, profilePic: data.url }));
      toast.success("Profile picture updated!");
    } catch (err) {
      toast.error(err.message || "Failed to upload profile picture");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to continue");
      setLoading(false);
      return navigate("/login");
    }

    const userId = getUserIdFromToken(token);
    if (!userId) {
      toast.error("Invalid session. Please log in again.");
      setLoading(false);
      return navigate("/login");
    }

    // Validate age
    if (Number(form.age) < 13) {
      toast.error("You must be at least 13 years old.");
      setLoading(false);
      return;
    }

    // Validate interests
    const interests = form.interests
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);
    if (interests.length > 10) {
      toast.error("You can have a maximum of 10 interests.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Use standard Authorization header
        },
        body: JSON.stringify({
          ...form,
          interests,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Update failed");

      window.dispatchEvent(new Event("authChange"));
      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
      if (err.message.includes("Unauthorized")) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <Toaster position="top-center" />
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">
          Edit Profile
        </h2>
        <div className="flex flex-col items-center mb-6">
          <img
            src={form.profilePic || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover mb-2"
          />
          <label className="cursor-pointer text-sm text-blue-600 hover:underline">
            Change Profile Picture
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="Username"
              required
            />
          </div>
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
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Age</label>
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
              <label className="text-sm font-medium text-gray-700 mb-1">Gender</label>
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
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Interests</label>
            <input
              name="interests"
              value={form.interests}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="Interests (comma separated, max 10)"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="Location"
            />
          </div>
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