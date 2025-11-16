import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const pageSizes = [1000, 2000, 3000, 4000, 5000];

  // Generate compact pagination
  const getVisiblePages = () => {
    const pages = [];

    // Always show first page
    pages.push(1);

    // Determine sliding window range
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    // Ensure only 4 pages max in window
    if (currentPage <= 3) {
      start = 2;
      end = Math.min(4, totalPages - 1);
    } else if (currentPage >= totalPages - 2) {
      start = Math.max(totalPages - 3, 2);
      end = totalPages - 1;
    }

    // Add sliding window pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add "..." if needed
    if (end < totalPages - 1) {
      pages.push("...");
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getVisiblePages();

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 border-t">
      {/* Page Size Dropdown */}
      <div className="flex items-center gap-2">
        <span className="text-sm">Rows per page:</span>
        <select
          className="border rounded px-2 py-1"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          {pageSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* Pagination Buttons */}
      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          className="px-3 py-1 border rounded disabled:opacity-40"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Prev
        </button>

        {/* Dynamic Pages */}
        {pages.map((page, idx) => {
          if (page === "...") {
            return (
              <span key={idx} className="px-3 py-1 text-gray-500">
                ...
              </span>
            );
          }

          return (
            <button
              key={idx}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 border rounded ${
                page === currentPage
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              {page}
            </button>
          );
        })}

        {/* Next */}
        <button
          className="px-3 py-1 border rounded disabled:opacity-40"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>

      {/* Page info */}
      <div className="text-sm">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

export default Pagination;
