import React, { useState, useEffect } from "react";

export default function EditModal({ isOpen, task, onSave, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setStatus(task.status || "pending");
      setError("");
    }
  }, [task]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen || !task) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setError("Task title cannot be empty.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      await onSave({
        id: task.id,
        title: cleanTitle,
        description: description.trim() || null,
        status,
      });
    } catch (err) {
      setError(err.message || "Failed to update task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-header">
          <div className="modal-header-info">
            <span className="modal-badge">Editing Task #{task.id}</span>
            <h3 className="modal-title">Edit Task</h3>
          </div>
          <button className="btn-icon close-btn" onClick={onCancel} aria-label="Close dialog">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            {error && (
              <div className="alert-error" role="alert">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* 1. Title */}
            <div className="form-group">
              <label htmlFor="edit-task-title" className="form-label">
                Title <span className="required-star">*</span>
              </label>
              <input
                id="edit-task-title"
                type="text"
                className={`form-input ${error && !title.trim() ? "input-error" : ""}`}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (e.target.value.trim()) setError("");
                }}
                placeholder="Task title"
                autoFocus
              />
            </div>

            {/* 2. Description */}
            <div className="form-group">
              <label htmlFor="edit-task-desc" className="form-label">
                Description <span className="label-optional">(Optional)</span>
              </label>
              <textarea
                id="edit-task-desc"
                rows="4"
                className="form-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Update description or notes..."
              />
            </div>

            {/* 3. Status */}
            <div className="form-group">
              <label htmlFor="edit-task-status" className="form-label">
                Status
              </label>
              <div className="status-selector-group">
                <button
                  type="button"
                  className={`status-chip ${status === "pending" ? "selected pending" : ""}`}
                  onClick={() => setStatus("pending")}
                >
                  <span className="chip-dot pending"></span>
                  Pending
                </button>
                <button
                  type="button"
                  className={`status-chip ${status === "completed" ? "selected completed" : ""}`}
                  onClick={() => setStatus("completed")}
                >
                  <span className="chip-dot completed"></span>
                  Completed
                </button>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
