from typing import List, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate

def get_tasks(
    db: Session,
    status: Optional[str] = None,
) -> List[Task]:
    query = db.query(Task)
    
    if status and status.lower() in ("pending", "completed"):
        query = query.filter(Task.status == status.lower())
    
    # Default: newest tasks first
    query = query.order_by(desc(Task.created_at))
    return query.all()

def get_task_by_id(db: Session, task_id: int) -> Optional[Task]:
    return db.query(Task).filter(Task.id == task_id).first()

def create_task(db: Session, task_in: TaskCreate) -> Task:
    now = datetime.now(timezone.utc)
    db_task = Task(
        title=task_in.title,
        description=task_in.description,
        status="pending",
        created_at=now,
        updated_at=now,
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def update_task(db: Session, db_task: Task, task_in: TaskUpdate) -> Task:
    update_data = task_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_task, field, value)
    
    db_task.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(db_task)
    return db_task

def toggle_task_status(db: Session, db_task: Task) -> Task:
    db_task.status = "completed" if db_task.status == "pending" else "pending"
    db_task.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(db_task)
    return db_task

def delete_task(db: Session, db_task: Task) -> None:
    db.delete(db_task)
    db.commit()
