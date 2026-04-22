import { BookmarkCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

import { useGetSavedJobs } from "../../hooks/Job";
import JobCard from "../../components/JobCard/JobCard";
import Pagination from "../../components/Pagination/Pagination";

import "./SavedJobs.css";

const SavedJobs = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { data: response, isLoading } = useGetSavedJobs(currentPage, 10, true);

  const jobs = response?.data?.content || [];
  const totalPages = response?.data.page.totalPages || 1;

  if (isLoading) {
    return (
      <div className="saved-job-loader-container">
        <div className="loader"></div>

        <p className="saved-job-loader-text">Loading your saved jobs...</p>
      </div>
    );
  }

  return (
    <div className="saved-job-page">
      <div className="saved-job-container">
        <div className="saved-job-header">
          <div>
            <h1 className="saved-job-title">Saved Jobs</h1>

            <p className="saved-job-subtitle">Jobs you bookmarked for later.</p>
          </div>
        </div>

        {jobs.length === 0 && currentPage === 0 ? (
          <div className="saved-job-card">
            <div className="saved-job-empty-state">
              <BookmarkCheck
                size={48}
                className="saved-job-muted saved-job-mb-4"
              />

              <h3 className="saved-job-empty-title">No saved jobs yet</h3>

              <p className="saved-job-empty-desc">
                Save interesting jobs and they will appear here.
              </p>

              <Link to="/" className="saved-job-btn-link saved-job-mt-6">
                Browse jobs →
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="saved-job-list">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} isSaved={true} />
              ))}
            </div>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
