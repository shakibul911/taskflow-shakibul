import React from "react";

export default function TaskItem({
  task,
  onToggleStatus,
  onEdit,
  onDelete,
}) {
  const isCompleted = task.status === "completed";

  // Format created_at date
  const formatDate = (isoString) => {
    if (!isoString) return "";
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className={`task-card ${isCompleted ? "task-completed" : "task-pending"}`}>
      {/* Checkbox toggle */}
      <div className="task-toggle-wrapper">
        <button
          type="button"
          className={`checkbox-custom ${isCompleted ? "checked" : ""}`}
          onClick={() => onToggleStatus(task.id)}
          aria-label={isCompleted ? "Mark task as pending" : "Mark task as completed"}
        >
          {isCompleted && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Main task content */}
      <div className="task-content">
        <div className="task-header-line">
          <h4 className={`task-title ${isCompleted ? "title-strikethrough" : ""}`}>
            {task.title}
          </h4>

          {/* Status Badge */}
          <div className="task-badges">
            <span className={`badge badge-status ${task.status}`}>
              {task.status === "completed" ? "✓ Completed" : "⏳ Pending"}
            </span>
          </div>
        </div>

        {task.description && (
          <p className={`task-description ${isCompleted ? "desc-completed" : ""}`}>
            {task.description}
          </p>
        )}

        <div className="task-meta">
          <span className="meta-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Created: {formatDate(task.created_at)}
          </span>
        </div>
      </div>

      {/* Actions: Edit & Delete */}
      <div className="task-actions">
        <button
          type="button"
          className="action-btn edit-btn"
          onClick={() => onEdit(task)}
          title="Edit task"
          aria-label={`Edit task ${task.title}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>

        <button
          type="button"
          className="action-btn delete-btn"
          onClick={() => onDelete(task)}
          title="Delete task"
          aria-label={`Delete task ${task.title}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </button>
      </div>
    </div>
  );
}
