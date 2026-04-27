import React, { useEffect, useState } from "react";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import "./Home.css";
import { AnimatePresence, motion } from "motion/react";
import { useFilterJobs, useGetSavedJobs } from "../../hooks/Job";
import JobCard from "../../components/JobCard/JobCard";
import Pagination from "../../components/Pagination/Pagination";
import { useAppStore } from "../../store/useAppStore";
import Modal from "../../components/Modal/Modal";

const Home = () => {
  const [searchInput, setSearchInput] = useState("");

  const [locationInput, setLocationInput] = useState("");

  const [showWakeModal, setShowWakeModal] = useState(false);

  const [search, setSearch] = useState("");

  const [location, setLocation] = useState("");

  const [jobType, setJobType] = useState("");

  const [currentPage, setCurrentPage] = useState(0);

  const user = useAppStore((state) => state.user);

  const { data: response, isLoading } = useFilterJobs(
    search,
    location,
    jobType,
    currentPage,
    5,
  );

  useEffect(() => {
    if (!isLoading) return;

    const timer = setTimeout(() => {
      setShowWakeModal(true);
    }, 10000);

    return () => {
      clearTimeout(timer);
      setShowWakeModal(false);
    };
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [currentPage, isLoading]);

  const { data } = useGetSavedJobs(0, 5, !!user && user.role === "SEEKER");

  const savedJobs = data?.data.content ?? [];

  const savedJobIds = new Set(savedJobs.map((job) => job.id));

  const jobs = response?.data?.content ?? [];

  const totalPages = response?.data?.page?.totalPages || 1;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    setSearch(searchInput.trim());

    setLocation(locationInput.trim());

    setCurrentPage(0);
  };

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setJobType("");
    setSearchInput("");
    setLocationInput("");
    setCurrentPage(0);
  };

  return (
    <>
      <div className="home-container">
        <section className="home-hero">
          <div className="home-container-inner">
            <motion.h1
              initial={{
                opacity: 0,
                y: -20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="home-hero-title"
            >
              Find your next <span>career move</span>
            </motion.h1>

            <motion.p
              initial={{
                opacity: 0,
                y: -20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.1,
              }}
              className="home-hero-subtitle"
            >
              Explore thousands of job opportunities from top companies and
              startups around the world.
            </motion.p>

            <motion.form
              initial={{
                opacity: 0,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                delay: 0.2,
              }}
              onSubmit={handleSearch}
              className="home-search-form"
            >
              <div className="home-input-group">
                <Search className="home-input-icon" size={20} />

                <input
                  type="text"
                  placeholder="Job title or keywords"
                  className="home-search-input"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>

              <div className="home-input-divider"></div>

              <div className="home-input-group">
                <Filter className="home-input-icon" size={20} />

                <input
                  type="text"
                  placeholder="Location"
                  className="home-search-input"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                />
              </div>

              <button type="submit" className="home-search-button">
                Search
              </button>
            </motion.form>
          </div>
        </section>

        <main className="home-main-content">
          <div className="home-container-inner">
            <div className="home-jobs-layout">
              <aside className="home-filters-sidebar">
                <div className="home-filters-card">
                  <div className="home-filters-header">
                    <h3 className="home-filters-title">
                      <SlidersHorizontal size={16} />
                      Filters
                    </h3>

                    <button
                      onClick={clearFilters}
                      className="home-clear-filters"
                    >
                      Clear all
                    </button>
                  </div>

                  <div className="home-filter-section">
                    <label className="home-filter-section-label">
                      Job Type
                    </label>

                    <div className="home-filter-options">
                      {["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"].map(
                        (type) => (
                          <label key={type} className="home-filter-option">
                            <input
                              type="radio"
                              name="jobType"
                              checked={jobType === type}
                              onChange={() => {
                                setJobType(type);

                                setCurrentPage(0);
                              }}
                            />

                            <span className="home-filter-label-text">
                              {type.replace("_", " ")}
                            </span>
                          </label>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </aside>

              <div className="home-results-column">
                <div className="home-results-header">
                  <h2 className="home-results-count">
                    {isLoading
                      ? "Searching..."
                      : `${jobs.length} Results Found`}
                  </h2>
                </div>

                {isLoading ? (
                  <div className="home-jobs-list">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="home-skeleton home-animate-pulse"
                        style={{
                          height: "180px",
                          borderRadius: "16px",
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="home-jobs-list">
                      <AnimatePresence mode="popLayout">
                        {jobs.map((job) => (
                          <JobCard
                            key={job.id}
                            job={job}
                            isSaved={savedJobIds.has(job.id)}
                          />
                        ))}
                      </AnimatePresence>

                      {jobs.length === 0 && (
                        <div className="home-empty-state">
                          <div className="home-empty-icon-box">
                            <Search size={32} />
                          </div>

                          <h3 className="home-empty-title">
                            No jobs matched your search
                          </h3>

                          <p className="home-empty-desc">
                            Try adjusting your filters or search keywords.
                          </p>
                        </div>
                      )}
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
          </div>
        </main>
      </div>

      <Modal
        isOpen={showWakeModal}
        title="Starting server..."
        message="Backend is hosted on free tier. First request may take up to 1 minute."
        confirmText="Please wait..."
        cancelText=""
        isLoading={true}
        variant="primary"
        onConfirm={() => {}}
        onClose={() => {}}
      />
    </>
  );
};

export default Home;
