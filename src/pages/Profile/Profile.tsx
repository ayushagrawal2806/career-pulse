import React, { useState } from "react";

import {
  MapPin,
  Mail,
  FileText,
  Save,
  User as UserIcon,
  Link as LinkIcon,
} from "lucide-react";

import "./Profile.css";
import { useAppStore } from "../../store/useAppStore";
import { useProfile } from "../../hooks/Profile";
import type { User } from "../../models/User";
import type { ErrorModel } from "../../models/Error";
import type { ApiResponse } from "../../models/ApiResponse";
import { toast } from "react-toastify";

const Profile = () => {
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const [formData, setFormData] = useState(() => ({
    name: user?.name || "",
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
      bio: updatedUser.bio || "",
      location: updatedUser.location || "",
      resumeUrl: updatedUser.resumeUrl || "",
    });
  };

  const onError = (err: ErrorModel) => {
    toast.error(err.message);
  };

  const { mutate, isPending } = useProfile(onSuccess, onError);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
              <div className="avatar-large">
                <UserIcon size={48} />
              </div>
              <h2 className="profile-name-h2">
                {user.name || "Anonymous User"}
              </h2>
              <p className="profile-email-meta">
                <Mail size={12} /> {user.email}
              </p>
              <div className="role-tag">{user.role}</div>
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
                    className="profile-form-input"
                    style={{ paddingLeft: "1rem" }}
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="profile-form-group">
                  <label className="profile-form-label">Location</label>
                  <div className="profile-input-wrapper">
                    <MapPin className="profile-input-icon-left" size={20} />
                    <input
                      type="text"
                      name="location"
                      className="form-input"
                      placeholder="Location"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {user.role === "SEEKER" && (
                  <>
                    {/* <div className="form-group">
                      <label className="form-label">
                        Skills (comma separated)
                      </label>
                      <div className="input-wrapper">
                        <Briefcase className="input-icon-left" size={20} />
                        <input
                          type="text"
                          name="skills"
                          className="form-input"
                          placeholder="React, TypeScript, Node.js"
                          value={formData.skills}
                          onChange={handleChange}
                        />
                      </div>
                    </div> */}

                    <div className="profile-form-group">
                      <label className="profile-form-label">Resume URL</label>
                      <div className="profile-input-wrapper">
                        <LinkIcon
                          className="profile-input-icon-left"
                          size={20}
                        />
                        <input
                          type="url"
                          name="resumeUrl"
                          className="form-input"
                          placeholder="https://drive.google.com/..."
                          value={formData.resumeUrl}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="profile-form-group">
                  <label className="profile-form-label">Bio</label>
                  <div className="profile-input-wrapper">
                    <FileText className="profile-input-icon-left" size={20} />
                    <textarea
                      name="bio"
                      rows={4}
                      className="form-input"
                      placeholder="Tell us about yourself..."
                      value={formData.bio}
                      onChange={handleChange}
                    ></textarea>
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
