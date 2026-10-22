import React, { useState } from "react";

export default function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanTitle = title.trim();

    if (!cleanTitle) {
      setError("Task title is required and cannot be empty.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      await onAddTask({
        title: cleanTitle,
        description: description.trim() || null,
      });

      // Reset form
      setTitle("");
      setDescription("");
    } catch (err) {
      setError(err.message || "Failed to add task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div className="task-form-card">
      <div className="form-card-header">
        <div className="form-card-title-group">
          <span className="form-badge">Create</span>
          <h2 className="form-heading">Add a New Task</h2>
        </div>
        <span className="keyboard-hint">Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to submit</span>
      </div>

      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} noValidate>
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
          <label htmlFor="task-title" className="form-label">
            Title <span className="required-star">*</span>
          </label>
          <input
            id="task-title"
            type="text"
            className={`form-input ${error && !title.trim() ? "input-error" : ""}`}
            placeholder="What needs to be accomplished?"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (e.target.value.trim()) setError("");
            }}
          />
        </div>

        {/* 2. Description */}
        <div className="form-group">
          <label htmlFor="task-description" className="form-label">
            Description <span className="label-optional">(Optional)</span>
          </label>
          <textarea
            id="task-description"
            rows="3"
            className="form-textarea"
            placeholder="Add relevant notes, background details, or links..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* 3. Add Button */}
        <div className="form-actions-row">
          <button
            type="submit"
            className="btn btn-primary add-task-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="btn-spinner-wrapper">
                <span className="btn-spinner"></span>
                Creating Task...
              </span>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span>Add Task</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
