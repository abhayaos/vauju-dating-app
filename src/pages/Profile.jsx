import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { Pencil, X, Camera, Plus, Trash2, MapPin, Cake, Sparkles } from "lucide-react";
import { api } from "../api";

// ── Edit Profile Modal ─────────────────────────────────────────────────────────
function EditProfileModal({ profile, onClose, onSave }) {
  const [form, setForm] = useState({
    fullName: profile.fullName || "",
    age: profile.age || "",
    bio: profile.bio || "",
    interests: (profile.interests || []).join(", "),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSave({
        fullName: form.fullName,
        bio: form.bio,
        age: Number(form.age),
        interests: form.interests,
      });
      onClose();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10 rounded-t-3xl">
          <h2 className="text-lg font-bold">Edit Profile</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Name</label>
            <input
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="Your name"
              className="mt-1.5 w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Age</label>
            <input
              type="number"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              placeholder="Your age"
              min={18} max={99}
              className="mt-1.5 w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Tell people about yourself..."
              rows={4}
              maxLength={200}
              className="mt-1.5 w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition resize-none"
            />
            <p className="text-xs text-gray-400 text-right mt-1">{form.bio.length}/200</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Interests</label>
            <input
              value={form.interests}
              onChange={(e) => setForm({ ...form, interests: e.target.value })}
              placeholder="e.g. Hiking, Music, Coffee"
              className="mt-1.5 w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition"
            />
            <p className="text-xs text-gray-400 mt-1">Separate with commas</p>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-2xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl text-sm font-semibold transition disabled:opacity-60 hover:opacity-90">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Photo Grid ─────────────────────────────────────────────────────────────────
function PhotoGrid({ photos, onUpload, onDelete, uploading }) {
  const inputRef = useRef(null);
  const MAX = 6;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Camera size={16} className="text-pink-500" />
          <span className="text-sm font-semibold text-gray-700">Photos</span>
          <span className="text-xs text-gray-400">({photos.length}/{MAX})</span>
        </div>
        {photos.length < MAX && (
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1 text-xs text-pink-500 font-medium hover:text-pink-600 transition disabled:opacity-50"
          >
            <Plus size={14} />
            {uploading ? "Uploading..." : "Add photo"}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
      />

      <div className="grid grid-cols-3 gap-2">
        {photos.map((src, i) => (
          <div key={i} className="relative group aspect-square">
            <img src={src} alt={`photo-${i}`} className="w-full h-full object-cover rounded-2xl" />
            <button
              onClick={() => onDelete(src)}
              className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
            >
              <Trash2 size={11} className="text-white" />
            </button>
          </div>
        ))}
        {photos.length < MAX && (
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-300 hover:border-pink-300 hover:text-pink-300 transition disabled:opacity-50"
          >
            {uploading ? (
              <div className="w-5 h-5 border-2 border-pink-300 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Plus size={20} />
                <span className="text-xs">Add</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Avatar with upload ─────────────────────────────────────────────────────────
function Avatar({ profile, onUpload, uploading }) {
  const inputRef = useRef(null);
  const initials = profile.fullName?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";

  return (
    <div className="relative">
      {profile.photos?.[0] ? (
        <img
          src={profile.photos[0]}
          alt={profile.fullName}
          className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-xl"
        />
      ) : (
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 border-4 border-white shadow-xl flex items-center justify-center text-white text-3xl font-bold">
          {initials}
        </div>
      )}
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="absolute bottom-1 right-1 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center border-2 border-white shadow hover:bg-gray-700 transition disabled:opacity-50"
      >
        {uploading
          ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          : <Camera size={14} className="text-white" />
        }
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
      />
    </div>
  );
}

// ── Main Profile Page ──────────────────────────────────────────────────────────
export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ matches: 0, posts: 0, likes: 0 });
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api.getMe()
      .then((data) => {
        setProfile(data.user);
        setStats(data.stats || { matches: 0, posts: 0, likes: 0 });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (updated) => {
    const data = await api.updateMe(updated);
    setProfile(data.user);
    setSaveMsg("Profile updated!");
    setTimeout(() => setSaveMsg(null), 3000);
  };

  const handleUploadPhoto = async (file) => {
    setUploading(true);
    try {
      const data = await api.uploadPhoto(file);
      setProfile(data.user);
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (url) => {
    try {
      const data = await api.deletePhoto(url);
      setProfile(data.user);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!profile) return (
    <div className="flex items-center justify-center h-full text-gray-400">Could not load profile.</div>
  );

  const initials = profile.fullName?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";

  return (
    <>
      {showEdit && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEdit(false)}
          onSave={handleSave}
        />
      )}

      {/* Two-column on desktop, single column on mobile */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── LEFT CARD ── */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Cover */}
              <div className="h-28 bg-gradient-to-br from-pink-400 via-rose-400 to-orange-300 relative">
                <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
                  <Avatar profile={profile} onUpload={handleUploadPhoto} uploading={uploading} />
                </div>
              </div>

              {/* Info */}
              <div className="pt-16 pb-6 px-5 text-center">
                <h1 className="text-xl font-bold text-gray-900">{profile.fullName}</h1>

                <div className="flex items-center justify-center gap-3 mt-2 text-gray-400 text-sm">
                  {profile.age && (
                    <span className="flex items-center gap-1">
                      <Cake size={13} />
                      {profile.age} yrs
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <MapPin size={13} />
                    Nepal
                  </span>
                </div>

                {profile.bio && (
                  <p className="text-gray-500 text-sm leading-relaxed mt-3">{profile.bio}</p>
                )}

                <button
                  onClick={() => setShowEdit(true)}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-2xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                >
                  <Pencil size={14} />
                  Edit Profile
                </button>

                {saveMsg && (
                  <div className="mt-3 px-3 py-2 bg-green-50 border border-green-200 rounded-xl text-green-600 text-xs text-center">
                    {saveMsg}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT CONTENT ── */}
          <div className="flex-1 space-y-4">

            {/* Interests */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={16} className="text-pink-500" />
                <h2 className="text-sm font-bold text-gray-700">Interests</h2>
              </div>
              {profile.interests?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1.5 bg-gradient-to-r from-pink-50 to-rose-50 text-pink-600 border border-pink-100 rounded-full text-xs font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              ) : (
                <button
                  onClick={() => setShowEdit(true)}
                  className="text-sm text-gray-400 hover:text-pink-500 transition"
                >
                  + Add your interests
                </button>
              )}
            </div>

            {/* Photos */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
              <PhotoGrid
                photos={profile.photos || []}
                onUpload={handleUploadPhoto}
                onDelete={handleDeletePhoto}
                uploading={uploading}
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Matches", value: stats.matches, color: "from-pink-400 to-rose-400" },
                { label: "Posts", value: stats.posts, color: "from-purple-400 to-indigo-400" },
                { label: "Likes", value: stats.likes, color: "from-orange-400 to-amber-400" },
              ].map((s) => (
                <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-3xl p-4 text-white text-center`}>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs opacity-80 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
