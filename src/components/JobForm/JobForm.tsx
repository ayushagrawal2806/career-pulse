import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  ChevronLeft,
  Landmark,
  MapPin,
  Send,
  Type,
} from "lucide-react";
import { toast } from "react-toastify";

import "../../pages/PostJob/PostJob.css";
import { usePostJob, useUpdateJob } from "../../hooks/Job";

import type { JobRequestDto, JobResponseDto } from "../../models/Job";
import type { ApiResponse } from "../../models/ApiResponse";
import type { ErrorModel } from "../../models/Error";
import { useQueryClient } from "@tanstack/react-query";

interface JobFormProps {
  isEditMode: boolean;
  jobId?: string;
  initialData?: JobRequestDto;
}

const emptyForm: JobRequestDto = {
  title: "",
  companyName: "",
  location: "",
  type: "FULL_TIME",
  salaryMin: 0,
  salaryMax: 0,
  minExperience: 0,
  maxExperience: 0,
  about: {
    description: "",
    responsibilities: "",
    requirements: "",
    benefits: "",
    companyAbout: "",
    skills: "",
  },
};

const JobForm = ({ isEditMode, jobId, initialData }: JobFormProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<JobRequestDto>(
    initialData || emptyForm,
  );

  const [errors, setErrors] = useState({
    salaryMin: "",
    salaryMax: "",
    minExperience: "",
    maxExperience: "",
  });

  const validateFields = () => {
    const newErrors = {
      salaryMin: "",
      salaryMax: "",
      minExperience: "",
      maxExperience: "",
    };

    if (+formData.salaryMin > +formData.salaryMax) {
      newErrors.salaryMax = "Max salary must be greater";
    }

    if (+formData.minExperience > +formData.maxExperience) {
      newErrors.maxExperience = "Max experience must be greater";
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some(Boolean);
  };

  const onCreateSuccess = (response: ApiResponse<JobResponseDto>) => {
    toast.success(response.message);
    navigate("/dashboard");
  };

  const onUpdateSuccess = (response: ApiResponse<JobResponseDto>) => {
    toast.success(response.message);

    queryClient.invalidateQueries({
      queryKey: ["jobById", jobId],
    });

    queryClient.invalidateQueries({
      queryKey: ["my-jobs"],
    });

    navigate("/dashboard");
  };

  const onError = (err: ErrorModel) => {
    toast.error(err.message);
  };

  const { mutate: createJob, isPending: creating } = usePostJob(
    onCreateSuccess,
    onError,
  );

  const { mutate: updateJob, isPending: updating } = useUpdateJob(
    onUpdateSuccess,
    onError,
  );

  const isPending = creating || updating;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFields()) return;

    if (isEditMode && jobId) {
      updateJob({
        jobId,
        payload: formData,
      });
    } else {
      createJob(formData);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    const aboutFields = [
      "description",
      "responsibilities",
      "requirements",
      "benefits",
      "companyAbout",
      "skills",
    ];

    if (aboutFields.includes(name)) {
      setFormData((prev) => ({
        ...prev,
        about: {
          ...prev.about,
          [name]: value,
        },
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "salaryMin" ||
        name === "salaryMax" ||
        name === "minExperience" ||
        name === "maxExperience"
          ? Number(value)
          : value,
    }));
  };

  return (
    <div className="post-job-container">
      <div className="post-job-inner-container">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="post-job-back-link"
        >
          <ChevronLeft size={16} />
          Back
        </button>

        <div className="post-job-form-card">
          <div className="post-job-card-header">
            <h1 className="post-job-form-heading">
              {isEditMode ? "Edit Job Opportunity" : "Post a New Opportunity"}
            </h1>

            <p className="post-job-form-subtitle">
              {isEditMode
                ? "Update your job listing details."
                : "Find your next great hire."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="post-job-form">
            <div className="post-job-grid">
              <div className="post-job-grid-span-2">
                <label className="post-job-form-label">Job Title</label>

                <div className="post-job-input-wrapper">
                  <Type className="post-job-input-icon-left" size={20} />

                  <input
                    type="text"
                    name="title"
                    required
                    className="post-job-form-input"
                    placeholder="e.g. Senior Software Engineer"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="post-job-form-label">Company Name</label>

                <div className="post-job-input-wrapper">
                  <Briefcase className="post-job-input-icon-left" size={20} />

                  <input
                    type="text"
                    name="companyName"
                    required
                    className="post-job-form-input"
                    placeholder="e.g. Google"
                    value={formData.companyName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="post-job-form-label">Location</label>

                <div className="post-job-input-wrapper">
                  <MapPin className="post-job-input-icon-left" size={20} />

                  <input
                    type="text"
                    name="location"
                    required
                    className="post-job-form-input"
                    placeholder="e.g. Bangalore, India"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="post-job-grid-span-2">
                <label className="post-job-form-label">Job Type</label>

                <div className="post-job-input-wrapper">
                  <select
                    name="type"
                    className="post-job-form-input post-job-no-icon-input"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="INTERNSHIP">Internship</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="post-job-form-label">Min Salary</label>

                <div className="post-job-input-wrapper">
                  <Landmark className="post-job-input-icon-left" size={20} />

                  <input
                    type="number"
                    name="salaryMin"
                    className="post-job-form-input"
                    placeholder="e.g. 400000"
                    value={formData.salaryMin === 0 ? "" : formData.salaryMin}
                    onChange={handleChange}
                  />
                </div>

                {errors.salaryMin && (
                  <small className="post-job-field-error">
                    {errors.salaryMin}
                  </small>
                )}
              </div>

              <div>
                <label className="post-job-form-label">Max Salary</label>

                <div className="post-job-input-wrapper">
                  <Landmark className="post-job-input-icon-left" size={20} />

                  <input
                    type="number"
                    name="salaryMax"
                    className="post-job-form-input"
                    placeholder="e.g. 800000"
                    value={formData.salaryMax === 0 ? "" : formData.salaryMax}
                    onChange={handleChange}
                  />
                </div>

                {errors.salaryMax && (
                  <small className="post-job-field-error">
                    {errors.salaryMax}
                  </small>
                )}
              </div>

              <div>
                <label className="post-job-form-label">Min Experience</label>

                <div className="post-job-input-wrapper">
                  <input
                    type="number"
                    name="minExperience"
                    className="post-job-form-input post-job-no-icon-input"
                    placeholder="e.g. 1"
                    value={
                      formData.minExperience === 0 ? "" : formData.minExperience
                    }
                    onChange={handleChange}
                    required
                  />
                </div>

                {errors.minExperience && (
                  <small className="post-job-field-error">
                    {errors.minExperience}
                  </small>
                )}
              </div>

              <div>
                <label className="post-job-form-label">Max Experience</label>

                <div className="post-job-input-wrapper">
                  <input
                    type="number"
                    name="maxExperience"
                    className="post-job-form-input post-job-no-icon-input"
                    placeholder="e.g. 3"
                    value={
                      formData.maxExperience === 0 ? "" : formData.maxExperience
                    }
                    onChange={handleChange}
                    required
                  />
                </div>

                {errors.maxExperience && (
                  <small className="post-job-field-error">
                    {errors.maxExperience}
                  </small>
                )}
              </div>

              <div className="post-job-grid-span-2">
                <label className="post-job-form-label">Job Description</label>

                <div className="post-job-input-wrapper">
                  <textarea
                    name="description"
                    required
                    rows={6}
                    className="post-job-form-input post-job-textarea-input post-job-no-icon-input"
                    placeholder="Example: We are hiring a Backend Engineer to build scalable APIs, work with cross-functional teams, and improve system performance."
                    value={formData.about.description}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="post-job-grid-span-2">
                <label className="post-job-form-label">Responsibilities</label>

                <div className="post-job-input-wrapper">
                  <textarea
                    name="responsibilities"
                    required
                    rows={4}
                    className="post-job-form-input post-job-textarea-input post-job-no-icon-input"
                    placeholder="Example: Design REST APIs, write clean code, optimize queries, review pull requests, collaborate with product team."
                    value={formData.about.responsibilities}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="post-job-grid-span-2">
                <label className="post-job-form-label">Requirements</label>

                <div className="post-job-input-wrapper">
                  <textarea
                    name="requirements"
                    required
                    rows={4}
                    className="post-job-form-input post-job-textarea-input post-job-no-icon-input"
                    placeholder="Example: 2+ years experience, Java, Spring Boot, SQL, Git, problem-solving skills."
                    value={formData.about.requirements}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="post-job-grid-span-2">
                <label className="post-job-form-label">Skills</label>

                <div className="post-job-input-wrapper">
                  <textarea
                    name="skills"
                    required
                    rows={2}
                    className="post-job-form-input post-job-textarea-input post-job-no-icon-input"
                    placeholder="Example: Java, Spring Boot, PostgreSQL, Docker, AWS"
                    value={formData.about.skills}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="post-job-grid-span-2">
                <label className="post-job-form-label">Benefits</label>

                <div className="post-job-input-wrapper">
                  <textarea
                    name="benefits"
                    rows={2}
                    className="post-job-form-input post-job-textarea-input post-job-no-icon-input"
                    placeholder="Example: Health insurance, flexible hours, annual bonus, hybrid work, paid leaves."
                    value={formData.about.benefits}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="post-job-grid-span-2">
                <label className="post-job-form-label">Company About</label>

                <div className="post-job-input-wrapper">
                  <textarea
                    name="companyAbout"
                    rows={6}
                    className="post-job-form-input post-job-textarea-input post-job-no-icon-input"
                    placeholder="Example: Google is a global technology company building products used by billions worldwide."
                    value={formData.about.companyAbout}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="post-job-submit-btn"
            >
              {isPending ? (
                isEditMode ? (
                  "Updating..."
                ) : (
                  "Posting..."
                )
              ) : (
                <>
                  <Send size={18} />
                  {isEditMode ? "Update Job" : "Post Job Listing"}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobForm;
