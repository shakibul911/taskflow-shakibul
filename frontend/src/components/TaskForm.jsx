import React, { useState } from "react";

export default function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showDescription, setShowDescription] = useState(false);
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
      setShowDescription(false);
    } catch (err) {
      setError(err.message || "Failed to add task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="task-form-card">
      <form onSubmit={handleSubmit} noValidate>
        {error && (
          <div className="alert-error" role="alert">
            <span className="alert-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div className="form-main-input-wrapper">
          <input
            type="text"
            className={`form-input main-input ${error ? "input-error" : ""}`}
            placeholder="Add a new task (e.g., Prepare quarterly review, Read chapter 4)..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (e.target.value.trim()) setError("");
            }}
          />
          <button
            type="submit"
            className="btn btn-primary add-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span>Adding...</span>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span>Add Task</span>
              </>
            )}
          </button>
        </div>

        <div className="form-toggle-row">
          <button
            type="button"
            className="toggle-options-btn"
            onClick={() => setShowDescription(!showDescription)}
          >
            <span>{showDescription ? "▲ Hide Description" : "▼ Add Description (Optional)"}</span>
          </button>
        </div>

        {showDescription && (
          <div className="form-expanded-options">
            <div className="form-group">
              <label htmlFor="task-description">Description (Optional)</label>
              <textarea
                id="task-description"
                rows="3"
                className="form-textarea"
                placeholder="Add optional notes, details, or context..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
