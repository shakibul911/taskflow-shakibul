from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from app.crud import task as crud_task

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])

@router.get("", response_model=List[TaskResponse], status_code=status.HTTP_200_OK)
def get_all_tasks(
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by status: pending or completed"),
    db: Session = Depends(get_db),
):
    """
    Return all tasks in the database with optional status filtering.
    """
    tasks = crud_task.get_tasks(db, status=status_filter)
    return tasks

@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_new_task(
    task_in: TaskCreate,
    db: Session = Depends(get_db),
):
    """
    Create a new task. Requires a non-empty title. Optional description.
    """
    return crud_task.create_task(db, task_in)

@router.get("/{task_id}", response_model=TaskResponse, status_code=status.HTTP_200_OK)
def get_single_task(
    task_id: int,
    db: Session = Depends(get_db),
):
    """
    Retrieve a specific task by its ID.
    """
    task = crud_task.get_task_by_id(db, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID {task_id} not found",
        )
    return task

@router.put("/{task_id}", response_model=TaskResponse, status_code=status.HTTP_200_OK)
def update_task(
    task_id: int,
    task_in: TaskUpdate,
    db: Session = Depends(get_db),
):
    """
    Update an existing task (title, description, or status).
    """
    db_task = crud_task.get_task_by_id(db, task_id)
    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID {task_id} not found",
        )
    return crud_task.update_task(db, db_task, task_in)

@router.patch("/{task_id}/toggle", response_model=TaskResponse, status_code=status.HTTP_200_OK)
def toggle_task(
    task_id: int,
    db: Session = Depends(get_db),
):
    """
    Toggle task status between 'pending' and 'completed'.
    """
    db_task = crud_task.get_task_by_id(db, task_id)
    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID {task_id} not found",
        )
    return crud_task.toggle_task_status(db, db_task)

@router.delete("/{task_id}", status_code=status.HTTP_200_OK)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
):
    """
    Permanently delete a task by its ID.
    """
    db_task = crud_task.get_task_by_id(db, task_id)
    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID {task_id} not found",
        )
    crud_task.delete_task(db, db_task)
    return {"message": "Task deleted successfully", "id": task_id}
