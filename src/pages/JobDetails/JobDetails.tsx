import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import {
  MapPin,
  Building2,
  Clock,
  Landmark,
  Calendar,
  ChevronLeft,
  Share2,
  FileText,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import "./JobDetails.css";
import { useAppStore } from "../../store/useAppStore";
import { useApplyJob, useGetJobById } from "../../hooks/Job";
import { useQueryClient } from "@tanstack/react-query";
import type { ErrorModel } from "../../models/Error";
import { toast } from "react-toastify";
import type { ApiResponse } from "../../models/ApiResponse";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const user = useAppStore((state) => state.user);

  const { data: response, isLoading } = useGetJobById(id);
  const job = response?.data;

  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeUrl, setResumeUrl] = useState(user?.resumeUrl ?? "");

  const onSuccess = (data: ApiResponse<void>) => {
    toast.success(data.message);
    setApplying(false);
    setApplied(true);
    queryClient.invalidateQueries({
      queryKey: ["jobById", id],
    });
  };

  const onError = (error: ErrorModel) => {
    setApplying(false);
    toast.error(error.message);
    console.error(error.message);
  };

  const { mutate: applyJob } = useApplyJob(onSuccess, onError);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }
    setApplying(true);
    const payload = {
      jobId: id ?? "",
      data: {
        resumeUrl: resumeUrl,
        coverLetter: coverLetter,
      },
    };
    applyJob(payload);
  };

  if (isLoading)
    return (
      <div className="job-details-loader-wrapper">
        <div className="job-details-loader-container">
          <div className="skeleton job-details-skeleton-title"></div>
          <div className="skeleton job-details-skeleton-box"></div>
        </div>
      </div>
    );

  if (!job)
    return (
      <div className="job-details-not-found">
        <AlertCircle size={48} className="job-details-not-found-icon" />

        <h2 className="job-details-not-found-title">Job not found</h2>

        <Link to="/" className="job-details-not-found-link">
          Back to browse
        </Link>
      </div>
    );

  return (
    <div className="job-details-page">
      <div className="job-details-header">
        <div className="job-details-header-inner">
          <Link to="/" className="job-details-back-link">
            <ChevronLeft size={16} />
            Back to Jobs
          </Link>

          <div className="job-details-header-content-wrapper">
            <div className="job-details-main-info">
              <div className="job-details-company-large-logo">
                <Building2 size={40} />
              </div>

              <div>
                <h1 className="job-details-title-h1">{job.title}</h1>

                <div className="job-details-meta-horizontal">
                  <strong>{job.company}</strong>

                  <div className="job-details-meta-item">
                    <MapPin size={16} />
                    {job.location}
                  </div>

                  <div className="job-details-meta-item">
                    <Clock size={16} />
                    {job.type.replace("_", " ")}
                  </div>
                </div>
              </div>
            </div>

            <div className="job-details-header-actions">
              <button className="icon-btn-secondary">
                <Share2 size={20} />
              </button>

              {user?.role !== "RECRUITER" && !applied && (
                <button className="job-details-apply-btn" onClick={() => {}}>
                  Apply Now
                </button>
              )}

              {applied && (
                <div className="job-details-applied-badge">
                  <CheckCircle2 size={20} />
                  Applied
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="job-details-grid">
        <div className="job-details-main-col">
          <section
            className="job-details-content-section"
            style={{ marginBottom: "1rem" }}
          >
            <h2 className="job-details-section-title">About the Role</h2>

            <div className="job-details-description-body">
              {job.description}
            </div>
          </section>

          {user?.role !== "RECRUITER" && !applied && (
            <section
              id="apply-form"
              className="job-details-content-section job-details-apply-form-section"
            >
              <h2 className="job-details-section-title">
                Apply for this position
              </h2>

              <form onSubmit={handleApply} className="job-details-form">
                <div className="job-details-form-group">
                  <label className="job-details-form-label">Resume URL</label>

                  <input
                    type="url"
                    className="job-details-form-input"
                    style={{ paddingLeft: "1rem" }}
                    placeholder="Link to your resume..."
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    required
                  />
                </div>

                <div className="job-details-form-group">
                  <label className="job-details-form-label">Cover Letter</label>

                  <textarea
                    rows={6}
                    className="job-details-form-input"
                    placeholder="Introduce yourself..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    style={{
                      paddingLeft: "1rem",
                      resize: "vertical",
                    }}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={applying}
                  className="job-details-submit-btn"
                >
                  {applying
                    ? "Submitting Application..."
                    : "Submit Application"}
                </button>
              </form>
            </section>
          )}

          {applied && (
            <div className="job-details-content-section job-details-applied-confirmation">
              <CheckCircle2 size={48} className="job-details-applied-icon" />

              <h3 className="job-details-applied-title">
                Application Submitted!
              </h3>

              <p className="job-details-applied-text">
                The recruiter will be notified and you can track your status in
                your dashboard.
              </p>

              <Link to="/dashboard" className="job-details-applied-link">
                View my applications
              </Link>
            </div>
          )}
        </div>

        <div className="job-details-sidebar">
          <aside className="job-details-sidebar-card">
            <h3 className="job-details-sidebar-title">Job Overview</h3>

            <div className="job-details-overview-list">
              <div className="job-details-overview-item">
                <div className="job-details-overview-icon">
                  <Calendar size={20} />
                </div>

                <div>
                  <p className="job-details-overview-label">Date Posted</p>

                  <p className="job-details-overview-value">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="job-details-overview-item">
                <div className="job-details-overview-icon">
                  <MapPin size={20} />
                </div>

                <div>
                  <p className="job-details-overview-label">Location</p>

                  <p className="job-details-overview-value">{job.location}</p>
                </div>
              </div>

              <div className="job-details-overview-item">
                <div className="job-details-overview-icon">
                  <Landmark size={20} />
                </div>

                <div>
                  <p className="job-details-overview-label">Salary</p>

                  <p className="job-details-overview-value">
                    ₹{job.salaryMin.toLocaleString()}- ₹
                    {job.salaryMax.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="job-details-overview-item">
                <div className="job-details-overview-icon">
                  <Clock size={20} />
                </div>

                <div>
                  <p className="job-details-overview-label">Experience</p>

                  <p className="job-details-overview-value">
                    {job.minExperience} - {job.maxExperience} Years
                  </p>
                </div>
              </div>

              <div className="job-details-overview-item">
                <div className="job-details-overview-icon">
                  <FileText size={20} />
                </div>

                <div>
                  <p className="job-details-overview-label">Category</p>

                  <p className="job-details-overview-value">General</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
