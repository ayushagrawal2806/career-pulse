import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Pagination.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(0);

      if (currentPage > 2) {
        pages.push("...");
      }

      const start = Math.max(1, currentPage - 1);

      const end = Math.min(totalPages - 2, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 3) {
        pages.push("...");
      }

      pages.push(totalPages - 1);
    }

    return pages;
  };

  return (
    <div className="pagination-container">
      <button
        type="button"
        onClick={handlePrevious}
        disabled={currentPage === 0}
        aria-label="Previous page"
        className="pagination-button"
      >
        <ChevronLeft size={18} />
        <span>Previous</span>
      </button>

      <div className="pagination-pages">
        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span key={`dots-${index}`} className="pagination-dots">
              ...
            </span>
          ) : (
            <button
              type="button"
              key={page}
              onClick={() => typeof page === "number" && onPageChange(page)}
              className={`pagination-page ${
                currentPage === page ? "active" : ""
              }`}
            >
              {Number(page) + 1}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        onClick={handleNext}
        disabled={currentPage === totalPages - 1}
        aria-label="Next page"
        className="pagination-button"
      >
        <span>Next</span>

        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;
