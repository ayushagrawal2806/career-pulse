import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import {
  MapPin,
  Building2,
  Clock,
  Landmark,
  Calendar,
  ChevronLeft,
  Share2,
  CheckCircle2,
  AlertCircle,
  Briefcase,
} from "lucide-react";

import "./JobDetails.css";

import { useAppStore } from "../../store/useAppStore";
import { useGetJobById } from "../../hooks/Job";
import ApplyJobModal from "../../components/ApplyJobModal/ApplyJobModal";
import { toast } from "react-toastify";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = useAppStore((state) => state.user);

  const { data: response, isLoading } = useGetJobById(id);
  const job = response?.data;

  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleOpenApply = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setIsApplyOpen(true);
  };

  const handleSharePress = () => {
    const url = window.location.href;

    if (navigator.share) {
      navigator.share({
        title: job?.title,
        text: `Check out this job: ${job?.title} at ${job?.companyName}`,
        url,
      });
    } else {
      navigator.clipboard.writeText(url).then(() => {
        toast.success("Link copied to clipboard!");
      });
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  if (isLoading) {
    return (
      <div className="job-details-loader-wrapper">
        <div className="job-details-loader-container">
          <div className="job-details-skeleton job-details-skeleton-title"></div>
          <div className="job-details-skeleton job-details-skeleton-box"></div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="job-details-not-found">
        <AlertCircle size={48} className="job-details-not-found-icon" />

        <h2 className="job-details-not-found-title">Job not found</h2>

        <Link to="/" className="job-details-not-found-link">
          Back to browse
        </Link>
      </div>
    );
  }

  return (
    <>
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
                    <strong>{job.companyName}</strong>

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
                <button
                  className="icon-btn-secondary"
                  onClick={handleSharePress}
                >
                  <Share2 size={20} />
                </button>

                {user?.role !== "RECRUITER" && !applied && (
                  <button
                    className="job-details-apply-btn"
                    onClick={handleOpenApply}
                  >
                    Apply Now
                  </button>
                )}

                {applied && (
                  <div className="job-details-applied-badge">
                    <CheckCircle2 size={20} />
                    Applied
                  </div>
                )}

                {user?.role === "RECRUITER" && (
                  <div className="job-details-applied-badge">
                    <CheckCircle2 size={20} />
                    Recruiter View
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="job-details-grid">
          <div className="job-details-main-col">
            <section className="job-details-content-section">
              <div className="job-details-section-header">
                <Briefcase size={20} />
                <h2 className="job-details-section-title">Job Description</h2>
              </div>

              <div className="job-details-description-body">
                <p>{job.about.description}</p>

                <br />

                <strong>Responsibilities</strong>
                <p>{job.about.responsibilities}</p>

                <br />

                <strong>Requirements</strong>
                <p>{job.about.requirements}</p>

                <br />

                <strong>Benefits</strong>
                <p>{job.about.benefits}</p>

                <br />

                <strong>About {job.companyName}</strong>
                <p>{job.about.companyAbout}</p>

                <br />

                <strong>Skills</strong>
                <p>{job.about.skills}</p>
              </div>
            </section>
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

                {/* <div className="job-details-overview-item">
                  <div className="job-details-overview-icon">
                    <MapPin size={20} />
                  </div>

                  <div>
                    <p className="job-details-overview-label">Location</p>

                    <p className="job-details-overview-value">{job.location}</p>
                  </div>
                </div> */}

                <div className="job-details-overview-item">
                  <div className="job-details-overview-icon">
                    <Landmark size={20} />
                  </div>

                  <div>
                    <p className="job-details-overview-label">Salary</p>

                    <p className="job-details-overview-value">
                      ₹{job.salaryMin.toLocaleString()} - ₹
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

                {/* <div className="job-details-overview-item">
                  <div className="job-details-overview-icon">
                    <FileText size={20} />
                  </div>

                  <div>
                    <p className="job-details-overview-label">Job Type</p>

                    <p className="job-details-overview-value">
                      {job.type.replace("_", " ")}
                    </p>
                  </div>
                </div> */}
              </div>
            </aside>
          </div>
        </div>
      </div>

      <ApplyJobModal
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        jobId={job.id}
        jobTitle={job.title}
        setApplied={setApplied}
      />
    </>
  );
};

export default JobDetails;
