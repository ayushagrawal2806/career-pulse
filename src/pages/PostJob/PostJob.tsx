import { useParams } from "react-router-dom";

import { useGetJobById } from "../../hooks/Job";

import "./PostJob.css";
import JobForm from "../../components/JobForm/JobForm";
import { useEffect } from "react";

const PostJob = () => {
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const { data: response, isLoading } = useGetJobById(id);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  if (isEditMode && isLoading) {
    return (
      <div className="post-job-container">
        <div className="post-job-inner-container">
          <div className="post-job-loader">Loading job details...</div>
        </div>
      </div>
    );
  }

  const initialData =
    isEditMode && response?.data
      ? {
          title: response.data.title,
          companyName: response.data.companyName,
          location: response.data.location,
          type: response.data.type,
          salaryMin: response.data.salaryMin ?? 0,
          salaryMax: response.data.salaryMax ?? 0,
          minExperience: response.data.minExperience,
          maxExperience: response.data.maxExperience,
          about: {
            description: response.data.about.description,
            responsibilities: response.data.about.responsibilities,
            requirements: response.data.about.requirements,
            benefits: response.data.about.benefits,
            companyAbout: response.data.about.companyAbout,
            skills: response.data.about.skills,
          },
        }
      : undefined;

  return (
    <JobForm
      key={id || "create"}
      isEditMode={isEditMode}
      jobId={id}
      initialData={initialData}
    />
  );
};

export default PostJob;
