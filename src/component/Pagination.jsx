import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const pageSizes = [1000, 2000, 3000, 4000, 5000];

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

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

      {/* Pagination buttons */}
      <div className="flex items-center gap-1">
        <button
          className="px-3 py-1 border rounded disabled:opacity-40"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Prev
        </button>

        {pages.map((num) => (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`px-3 py-1 border rounded ${
              num === currentPage
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200"
            }`}
          >
            {num}
          </button>
        ))}

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
