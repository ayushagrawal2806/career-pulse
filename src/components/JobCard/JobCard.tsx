import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import {
  MapPin,
  Building2,
  Clock,
  Landmark,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { motion } from "motion/react";
import "./JobCard.css";

import "./JobCard.css";
import type { JobResponseDto } from "../../models/Job";
import { useAppStore } from "../../store/useAppStore";
import { useSaveJob, useUnsaveJob } from "../../hooks/Job";
import type { ErrorModel } from "../../models/Error";
import { useQueryClient } from "@tanstack/react-query";
import type { ApiResponse } from "../../models/ApiResponse";
import { toast } from "react-toastify";

interface JobCardProps {
  job: JobResponseDto;
  key?: string;
  isSaved: boolean;
}

const JobCard = ({ job, isSaved: initialSaved }: JobCardProps) => {
  const user = useAppStore((state) => state.user);
  const [isSaved, setIsSaved] = useState(initialSaved);

  useEffect(() => {
    setIsSaved(initialSaved);
  }, [initialSaved]);

  const queryClient = useQueryClient();

  const onSaveSuccess = (data: ApiResponse<void>) => {
    setIsSaved(true);

    queryClient.invalidateQueries({
      queryKey: ["saved-jobs"],
    });

    toast.success(data.message);
  };

  const onSaveError = (error: ErrorModel) => {
    toast.error(error.message || "Failed to save job");
  };

  const onUnsaveSuccess = (data: ApiResponse<void>) => {
    setIsSaved(false);

    queryClient.invalidateQueries({
      queryKey: ["saved-jobs"],
    });

    toast.success(data.message);
  };

  const onUnsaveError = (error: ErrorModel) => {
    toast.error(error.message || "Failed to remove saved job");
  };

  const { mutate: saveJobMutate, isPending: saving } = useSaveJob(
    onSaveSuccess,
    onSaveError,
  );

  const { mutate: unsaveJobMutate, isPending: unsaving } = useUnsaveJob(
    onUnsaveSuccess,
    onUnsaveError,
  );

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user || user.role !== "SEEKER") return;

    if (!isSaved) {
      saveJobMutate(job.id);
    } else {
      unsaveJobMutate(job.id);
    }
  };

  const loading = saving || unsaving;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="job-card"
    >
      <div className="job-card-header">
        <div className="job-company-info">
          <div className="company-logo">
            <Building2 size={24} />
          </div>
          <div>
            <Link to={`/job/${job.id}`} className="job-title">
              {job.title}
            </Link>
            <div className="company-name">{job.company}</div>
          </div>
        </div>

        {user?.role === "SEEKER" && (
          <button
            onClick={toggleSave}
            disabled={loading}
            className={`save-btn ${isSaved ? "is-saved" : ""}`}
          >
            {isSaved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
          </button>
        )}
      </div>

      <div className="job-meta-tags">
        <div className="meta-tag">
          <MapPin />
          {job.location}
        </div>
        <div className="meta-tag">
          <Clock />
          {job.type.replace("_", " ")}
        </div>
        {job.salaryMin && job.salaryMax && (
          <div className="meta-tag">
            <Landmark />
            {job.salaryMin != null && job.salaryMax != null
              ? `₹${job.salaryMin.toLocaleString()} - ₹${job.salaryMax.toLocaleString()}`
              : job.salaryMax != null
                ? `Up to ₹${job.salaryMax.toLocaleString()}`
                : job.salaryMin != null
                  ? `From ₹${job.salaryMin.toLocaleString()}`
                  : "Not disclosed"}
          </div>
        )}
      </div>

      <p className="job-description">{job.description}</p>

      <div className="job-card-footer">
        <span className="post-date">
          Posted {new Date(job.createdAt).toLocaleDateString()}
        </span>
        <Link to={`/job/${job.id}`} className="view-details-link">
          View Details →
        </Link>
      </div>
    </motion.div>
  );
};

export default JobCard;
