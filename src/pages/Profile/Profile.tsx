import { useState } from "react";
import {
  FileText,
  Link as LinkIcon,
  Mail,
  MapPin,
  Phone,
  Save,
  User as UserIcon,
} from "lucide-react";
import { toast } from "react-toastify";

import "./Profile.css";

import { useAppStore } from "../../store/useAppStore";
import { useProfile } from "../../hooks/Profile";

import type { User } from "../../models/User";
import type { ErrorModel } from "../../models/Error";
import type { ApiResponse } from "../../models/ApiResponse";

const Profile = () => {
  const user = useAppStore((state) => state.user);

  const setUser = useAppStore((state) => state.setUser);

  const [formData, setFormData] = useState(() => ({
    name: user?.name || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    location: user?.location || "",
    resumeUrl: user?.resumeUrl || "",
  }));

  const onSuccess = (response: ApiResponse<User>) => {
    toast.success(response.message);

    setUser(response.data);

    const updatedUser = response.data;

    setFormData({
      name: updatedUser.name || "",
      phone: updatedUser.phone || "",
      bio: updatedUser.bio || "",
      location: updatedUser.location || "",
      resumeUrl: updatedUser.resumeUrl || "",
    });
  };

  const onError = (err: ErrorModel) => {
    toast.error(err.message);
  };

  const { mutate, isPending } = useProfile(onSuccess, onError);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutate(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1 className="profile-title">My Profile</h1>
        </div>

        <div className="profile-grid">
          <div className="profile-sidebar-col">
            <div className="profile-card-sidebar">
              <div className="profile-avatar-large">
                <UserIcon size={44} />
              </div>

              <h2 className="profile-name-h2">
                {user.name || "Anonymous User"}
              </h2>

              <p className="profile-email-meta">
                <Mail size={14} />
                {user.email}
              </p>

              <div className="profile-role-tag">{user.role}</div>
            </div>
          </div>

          <div className="profile-main-col">
            <div className="profile-form-card">
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="profile-form-group">
                  <label className="profile-form-label">Display Name</label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="profile-form-input profile-no-icon-input"
                  />
                </div>

                <div className="profile-form-group">
                  <label className="profile-form-label">Phone Number</label>

                  <div className="profile-input-wrapper">
                    <Phone size={20} className="profile-input-icon-left" />

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      placeholder="Enter phone number"
                      onChange={handleChange}
                      className="profile-form-input"
                      required
                    />
                  </div>
                </div>

                <div className="profile-form-group">
                  <label className="profile-form-label">Location</label>

                  <div className="profile-input-wrapper">
                    <MapPin size={20} className="profile-input-icon-left" />

                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      placeholder="Location"
                      onChange={handleChange}
                      required
                      className="profile-form-input"
                    />
                  </div>
                </div>

                {user.role === "SEEKER" && (
                  <div className="profile-form-group">
                    <label className="profile-form-label">Resume URL</label>

                    <div className="profile-input-wrapper">
                      <LinkIcon size={20} className="profile-input-icon-left" />

                      <input
                        type="url"
                        name="resumeUrl"
                        value={formData.resumeUrl}
                        placeholder="https://drive.google.com/..."
                        onChange={handleChange}
                        className="profile-form-input"
                      />
                    </div>
                  </div>
                )}

                <div className="profile-form-group">
                  <label className="profile-form-label">Bio</label>

                  <div className="profile-input-wrapper">
                    <FileText size={20} className="profile-input-icon-left" />

                    <textarea
                      rows={4}
                      name="bio"
                      value={formData.bio}
                      placeholder="Tell us about yourself..."
                      onChange={handleChange}
                      className="profile-form-input"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="profile-submit-btn"
                >
                  {isPending ? (
                    "Updating Profile..."
                  ) : (
                    <>
                      <Save size={18} />
                      Update Profile
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
