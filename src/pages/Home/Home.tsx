import React, { useState } from "react";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import "./Home.css";
import { AnimatePresence, motion } from "motion/react";
import { useFilterJobs, useGetSavedJobs } from "../../hooks/Job";
import JobCard from "../../components/JobCard/JobCard";
import Pagination from "../../components/Pagination/Pagination";
import { useAppStore } from "../../store/useAppStore";

const Home = () => {
  const [searchInput, setSearchInput] = useState("");
  const [locationInput, setLocationInput] = useState("");

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
  );

  const { data } = useGetSavedJobs(0, 10, !!user && user.role === "SEEKER");
  const savedJobs = data?.data.content;
  const savedJobIds = new Set(savedJobs?.map((job) => job.id) || []);

  const jobs = response?.data?.content || [];
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
    <div className="home-container">
      <section className="home-hero">
        <div className="container">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-title"
          >
            Find your next <span>career move</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="hero-subtitle"
          >
            Explore thousands of job opportunities from top companies and
            startups around the world.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSearch}
            className="search-form"
          >
            <div className="input-group">
              <Search className="input-icon" size={20} />

              <input
                type="text"
                placeholder="Job title or keywords"
                className="search-input"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            <div className="input-divider"></div>

            <div className="input-group">
              <Filter className="input-icon" size={20} />

              <input
                type="text"
                placeholder="Location"
                className="search-input"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
              />
            </div>

            <button type="submit" className="search-button">
              Search
            </button>
          </motion.form>
        </div>
      </section>

      <main className="main-content">
        <div className="container">
          <div className="jobs-layout">
            <aside className="filters-sidebar">
              <div className="filters-card">
                <div className="filters-header">
                  <h3 className="filters-title">
                    <SlidersHorizontal size={16} />
                    Filters
                  </h3>

                  <button onClick={clearFilters} className="clear-filters">
                    Clear all
                  </button>
                </div>

                <div className="filter-section">
                  <label className="filter-section-label">Job Type</label>

                  <div className="filter-options">
                    {["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"].map(
                      (type) => (
                        <label key={type} className="filter-option">
                          <input
                            type="radio"
                            name="jobType"
                            checked={jobType === type}
                            onChange={() => {
                              setJobType(type);
                              setCurrentPage(0);
                            }}
                          />

                          <span className="filter-label-text">
                            {type.replace("_", " ")}
                          </span>
                        </label>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </aside>

            <div className="results-column">
              <div className="results-header">
                <h2 className="results-count">
                  {isLoading ? "Searching..." : `${jobs.length} Results Found`}
                </h2>
              </div>

              {isLoading ? (
                <div className="jobs-list">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="skeleton animate-pulse"
                      style={{
                        height: "180px",
                        borderRadius: "16px",
                      }}
                    />
                  ))}
                </div>
              ) : (
                <>
                  <div className="jobs-list">
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
                      <div className="empty-state">
                        <div className="empty-icon-box">
                          <Search size={32} />
                        </div>

                        <h3 className="empty-title">
                          No jobs matched your search
                        </h3>

                        <p className="empty-desc">
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
  );
};

export default Home;
