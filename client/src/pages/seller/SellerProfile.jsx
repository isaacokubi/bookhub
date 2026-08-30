import { useEffect, useState } from "react";
import { useAuth, normalizeUser } from "../../context/AuthContext";
import { getProfile } from "../../api/authApi";
import { uploadSellerProfileImage } from "../../api/sellerProfileApi";

const MAX_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export default function SellerProfile() {
  const { user, login } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(user?.avatar || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.avatar) setPreview(user.avatar);
  }, [user?.avatar]);

  useEffect(() => () => {
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
  }, [preview]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setMessage("");
    setError("");

    if (!file) return;
    if (!ACCEPTED_TYPES.has(file.type)) {
      setError("Only JPEG, PNG, and WebP images are allowed.");
      event.target.value = "";
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("Profile image must be 10 MB or smaller.");
      event.target.value = "";
      return;
    }

    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Select a profile image first.");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const result = await uploadSellerProfileImage(selectedFile);
      const updatedUser = normalizeUser(result.user);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      // Refresh the AuthContext user without changing the current token.
      const profile = await getProfile();
      const refreshedUser = normalizeUser(profile);
      localStorage.setItem("user", JSON.stringify(refreshedUser));
      // AuthContext exposes login for session state; preserve the existing token.
      login({ token: localStorage.getItem("token"), user: refreshedUser });
      setSelectedFile(null);
      setPreview(refreshedUser.avatar || updatedUser.avatar || "");
      setMessage("Profile image updated successfully.");
    } catch (uploadError) {
      setError(uploadError.response?.data?.message || "Unable to upload profile image.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Seller Profile</h1>
          <p className="mt-1 text-sm text-slate-600">
            Add a professional profile image. It will appear on your public seller storefront.
          </p>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 ring-4 ring-slate-50">
            {preview ? (
              <img src={preview} alt="Seller profile preview" className="h-full w-full object-cover" />
            ) : (
              <span className="text-4xl">🏪</span>
            )}
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700" htmlFor="seller-avatar">
              Profile image
            </label>
            <input
              id="seller-avatar"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="mt-2 block w-full rounded-lg border border-slate-300 p-2 text-sm"
            />
            <p className="mt-2 text-xs text-slate-500">JPEG, PNG or WebP · maximum 10 MB</p>

            <button
              type="button"
              onClick={handleUpload}
              disabled={!selectedFile || saving}
              className="mt-4 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Uploading…" : "Save profile image"}
            </button>
          </div>
        </div>

        {message && <p className="mt-5 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
        {error && <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      </div>
    </div>
  );
}
