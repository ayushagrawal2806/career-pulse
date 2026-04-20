import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Briefcase,
  MapPin,
  Landmark,
  Type,
  Send,
  ChevronLeft,
} from "lucide-react";
import "./PostJob.css";
import { usePostJob } from "../../hooks/Job";
import type { JobRequestDto, JobResponseDto } from "../../models/Job";
import type { ApiResponse } from "../../models/ApiResponse";
import type { ErrorModel } from "../../models/Error";
import { toast } from "react-toastify";

export default function PostJobPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<JobRequestDto>({
    title: "",
    description: "",
    company: "",
    location: "",
    type: "FULL_TIME",
    salaryMin: 0,
    salaryMax: 0,
    minExperience: 0,
    maxExperience: 0,
  });

  const [errors, setErrors] = useState({
    minSalary: "",
    maxSalary: "",
    minExperience: "",
    maxExperience: "",
  });

  const validateFields = () => {
    const newErrors = {
      minSalary: "",
      maxSalary: "",
      minExperience: "",
      maxExperience: "",
    };

    if (+formData.minSalary > +formData.maxSalary)
      newErrors.maxSalary = "Max salary must be greater";

    if (+formData.minExperience > +formData.maxExperience)
      newErrors.maxExperience = "Max experience must be greater";

    setErrors(newErrors);

    return !Object.values(newErrors).some(Boolean);
  };

  const onSuccess = (response: ApiResponse<JobResponseDto>) => {
    toast.success("Job Posted Successfully");
    console.log("====================================");
    console.log(response.data);
    console.log("====================================");
  };

  const onError = (err: ErrorModel) => {
    console.log("====================================");
    console.log(err);
    console.log("====================================");
  };
  const { mutate, isPending } = usePostJob(onSuccess, onError);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFields()) return;
    mutate(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="post-job-container">
      <div className="post-job-inner-container">
        <button onClick={() => navigate(-1)} className="back-link">
          <ChevronLeft size={16} />
          Back
        </button>

        <div className="post-job-form-card">
          <div className="post-job-card-header">
            <h1 className="post-job-form-heading">Post a New Opportunity</h1>
            <p className="post-job-form-subtitle">Find your next great hire.</p>
          </div>

          <form onSubmit={handleSubmit} className="post-job-form">
            <div className="post-job-grid">
              <div className="grid-span-2">
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
                    name="company"
                    required
                    className="post-job-form-input"
                    placeholder="e.g. Google"
                    value={formData.company}
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

              <div className="grid-span-2">
                <label className="post-job-form-label">Job Type</label>
                <div className="post-job-input-wrapper">
                  <select
                    name="type"
                    className="post-job-form-input"
                    style={{ paddingLeft: "1rem" }}
                    value={formData.type}
                    onChange={handleChange}
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
                    value={formData.salaryMin}
                    onChange={handleChange}
                  />
                </div>
                {errors.minSalary && (
                  <small className="post-job-field-error">
                    {errors.minSalary}
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
                    value={formData.salaryMax}
                    onChange={handleChange}
                  />
                </div>
                {errors.maxSalary && (
                  <small className="post-job-field-error">
                    {errors.maxSalary}
                  </small>
                )}
              </div>

              <div>
                <label className="post-job-form-label">Min Experience</label>
                <div className="post-job-input-wrapper">
                  <input
                    type="number"
                    name="minExperience"
                    className="post-job-form-input"
                    style={{ paddingLeft: "1rem" }}
                    placeholder="e.g. 1"
                    value={formData.minExperience}
                    onChange={handleChange}
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
                    className="post-job-form-input"
                    style={{ paddingLeft: "1rem" }}
                    placeholder="e.g. 3"
                    value={formData.maxExperience}
                    onChange={handleChange}
                  />
                </div>
                {errors.maxExperience && (
                  <small className="post-job-field-error">
                    {errors.maxExperience}
                  </small>
                )}
              </div>

              <div className="grid-span-2">
                <label className="post-job-form-label">Job Description</label>
                <div className="post-job-input-wrapper">
                  <textarea
                    name="description"
                    required
                    rows={8}
                    className="post-job-form-input post-job-textarea-input"
                    style={{ paddingLeft: "1rem" }}
                    placeholder="Describe the role..."
                    value={formData.description}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="post-job-submit-btn"
            >
              {isPending ? (
                "Posting Job..."
              ) : (
                <>
                  <Send size={18} />
                  Post Job Listing
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
