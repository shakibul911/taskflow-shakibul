import React from "react";
import TaskItem from "./TaskItem";

export default function TaskList({
  tasks,
  isLoading,
  onToggleStatus,
  onEdit,
  onDelete,
  filter,
}) {
  if (isLoading) {
    return (
      <div className="task-list-loading">
        <div className="loading-spinner"></div>
        <p>Loading your tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <div className="empty-icon">
          {filter === "completed" ? "🎉" : filter === "pending" ? "📋" : "📝"}
        </div>
        <h4 className="empty-title">
          {filter === "completed"
            ? "No completed tasks yet"
            : filter === "pending"
            ? "No pending tasks right now"
            : "No tasks found"}
        </h4>
        <p className="empty-subtitle">
          {filter === "completed"
            ? "Check off tasks from your pending list to see them here!"
            : filter === "pending"
            ? "Great job! All caught up or ready to create a new task."
            : "Create your first task above to start organizing your day."}
        </p>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleStatus={onToggleStatus}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

