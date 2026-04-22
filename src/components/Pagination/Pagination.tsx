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
  //   if (totalPages <= 1) return null;

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
        className="pagination-button"
        onClick={handlePrevious}
        disabled={currentPage === 0}
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
        Previous
      </button>

      <div className="pagination-pages">
        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span key={`dots-${index}`} className="pagination-dots">
              ...
            </span>
          ) : (
            <button
              key={page}
              className={`pagination-page ${
                currentPage === page ? "active" : ""
              }`}
              onClick={() => typeof page === "number" && onPageChange(page)}
            >
              {typeof page === "number" ? page + 1 : page}
            </button>
          ),
        )}
      </div>

      <button
        className="pagination-button"
        onClick={handleNext}
        disabled={currentPage === totalPages - 1}
        aria-label="Next page"
      >
        Next
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;
