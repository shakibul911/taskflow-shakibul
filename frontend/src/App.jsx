import React, { useState, useEffect, useCallback, useMemo } from "react";
import api, { getErrorMessage } from "./services/api";
import TaskForm from "./components/TaskForm";
import FilterBar from "./components/FilterBar";
import TaskList from "./components/TaskList";
import EditModal from "./components/EditModal";
import ConfirmModal from "./components/ConfirmModal";
import Toast from "./components/Toast";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [toast, setToast] = useState(null);
  const [connectionError, setConnectionError] = useState(null);

  // Show a notification toast
  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Fetch tasks from backend
  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = {};
      if (filter !== "all") {
        params.status = filter;
      }

      const data = await api.getTasks(params);
      setTasks(data);
      setConnectionError(null);
    } catch (err) {
      const msg = getErrorMessage(err);
      setConnectionError("Cannot connect to backend API at " + (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api") + ". Ensure the FastAPI backend is running.");
      showToast(msg, "error");
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Compute counts for filter tabs
  const [totalCounts, setTotalCounts] = useState({ all: 0, pending: 0, completed: 0 });

  const refreshCounts = useCallback(async () => {
    try {
      const allTasks = await api.getTasks({});
      const pendingCount = allTasks.filter((t) => t.status === "pending").length;
      const completedCount = allTasks.filter((t) => t.status === "completed").length;
      setTotalCounts({
        all: allTasks.length,
        pending: pendingCount,
        completed: completedCount,
      });
    } catch {
      setTotalCounts({
        all: tasks.length,
        pending: tasks.filter((t) => t.status === "pending").length,
        completed: tasks.filter((t) => t.status === "completed").length,
      });
    }
  }, [tasks]);

  useEffect(() => {
    refreshCounts();
  }, [tasks.length, filter]);

  // Add task handler
  const handleAddTask = async (taskData) => {
    try {
      const newTask = await api.createTask(taskData);
      showToast(`Task "${newTask.title}" created successfully!`, "success");
      await loadTasks();
      await refreshCounts();
    } catch (err) {
      const msg = getErrorMessage(err);
      showToast(msg, "error");
      throw err;
    }
  };

  // Toggle status handler (single click / checkbox)
  const handleToggleStatus = async (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === "pending" ? "completed" : "pending";

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      const updated = await api.toggleTask(taskId);
      showToast(
        `Task marked as ${updated.status === "completed" ? "completed ✓" : "pending ⏳"}`,
        "info"
      );
      if (filter !== "all") {
        await loadTasks();
      }
      await refreshCounts();
    } catch (err) {
      // Revert on error
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: task.status } : t))
      );
      showToast(getErrorMessage(err), "error");
    }
  };

  // Save edit handler
  const handleSaveEdit = async (editData) => {
    try {
      const updated = await api.updateTask(editData.id, editData);
      showToast(`Task "${updated.title}" updated!`, "success");
      setEditingTask(null);
      await loadTasks();
      await refreshCounts();
    } catch (err) {
      const msg = getErrorMessage(err);
      showToast(msg, "error");
      throw err;
    }
  };

  // Confirm delete handler
  const handleConfirmDelete = async () => {
    if (!deletingTask) return;
    try {
      await api.deleteTask(deletingTask.id);
      showToast(`Task "${deletingTask.title}" deleted.`, "success");
      setDeletingTask(null);
      await loadTasks();
      await refreshCounts();
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    }
  };

  // Filter tasks in-memory by search term
  const displayedTasks = useMemo(() => {
    if (!searchTerm.trim()) return tasks;
    const term = searchTerm.toLowerCase();
    return tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(term) ||
        (t.description && t.description.toLowerCase().includes(term))
    );
  }, [tasks, searchTerm]);

  return (
    <div className="app-layout">
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Main Container */}
      <div className="app-container">
        {/* Header */}
        <header className="app-header">
          <div className="header-brand">
            <div className="brand-logo">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="brand-title">Task-Flow</h1>
              <p className="brand-subtitle">Personal Task Manager</p>
            </div>
          </div>
          <div className="header-meta">
            <span className="badge badge-meta">Full-Stack Mini Project</span>
          </div>
        </header>

        {/* Backend offline warning banner */}
        {connectionError && (
          <div className="banner-connection-warning">
            <span className="banner-icon">⚡</span>
            <span>{connectionError}</span>
            <button className="btn-retry" onClick={loadTasks}>
              Retry Connection
            </button>
          </div>
        )}

        {/* Task Creation Form */}
        <section className="section-task-form">
          <TaskForm onAddTask={handleAddTask} />
        </section>

        {/* Filter and Control Bar */}
        <section className="section-filters">
          <FilterBar
            filter={filter}
            onFilterChange={setFilter}
            counts={totalCounts}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </section>

        {/* Task List */}
        <main className="section-tasks">
          <TaskList
            tasks={displayedTasks}
            isLoading={isLoading}
            onToggleStatus={handleToggleStatus}
            onEdit={(task) => setEditingTask(task)}
            onDelete={(task) => setDeletingTask(task)}
            filter={filter}
          />
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <p>Task-Flow &bull; Built with React, FastAPI &amp; MySQL &bull; Clean REST CRUD Architecture</p>
        </footer>
      </div>

      {/* Edit Task Modal */}
      <EditModal
        isOpen={!!editingTask}
        task={editingTask}
        onSave={handleSaveEdit}
        onCancel={() => setEditingTask(null)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingTask}
        title="Delete Task"
        message={
          deletingTask
            ? `Are you sure you want to delete "${deletingTask.title}"? This task will be permanently removed from the database.`
            : ""
        }
        confirmText="Yes, Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingTask(null)}
      />
    </div>
  );
}
