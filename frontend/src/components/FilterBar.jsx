import React from "react";

export default function FilterBar({
  filter,
  onFilterChange,
  counts = { all: 0, pending: 0, completed: 0 },
  searchTerm,
  onSearchChange,
}) {
  return (
    <div className="filter-bar-container">
      {/* Status filter tabs */}
      <div className="filter-tabs" role="tablist" aria-label="Task status filter">
        <button
          type="button"
          className={`filter-tab ${filter === "all" ? "active" : ""}`}
          onClick={() => onFilterChange("all")}
          role="tab"
          aria-selected={filter === "all"}
        >
          All
          <span className="badge-count">{counts.all}</span>
        </button>

        <button
          type="button"
          className={`filter-tab ${filter === "pending" ? "active" : ""}`}
          onClick={() => onFilterChange("pending")}
          role="tab"
          aria-selected={filter === "pending"}
        >
          Pending
          <span className="badge-count pending">{counts.pending}</span>
        </button>

        <button
          type="button"
          className={`filter-tab ${filter === "completed" ? "active" : ""}`}
          onClick={() => onFilterChange("completed")}
          role="tab"
          aria-selected={filter === "completed"}
        >
          Completed
          <span className="badge-count completed">{counts.completed}</span>
        </button>
      </div>

      {/* Real-time search filter */}
      <div className="filter-controls">
        <div className="search-input-wrapper">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search-btn" onClick={() => onSearchChange("")} aria-label="Clear search">
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
