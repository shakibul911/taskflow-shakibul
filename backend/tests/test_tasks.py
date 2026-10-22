import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.main import app
from app.database import Base, get_db

# Use StaticPool with in-memory SQLite to share state across requests in the test
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

test_engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)

client = TestClient(app)

def test_create_task_success():
    payload = {
        "title": "Complete full-stack assignment",
        "description": "Write clean React, FastAPI, and MySQL code",
    }
    response = client.post("/api/tasks", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["id"] is not None
    assert data["title"] == payload["title"]
    assert data["description"] == payload["description"]
    assert data["status"] == "pending"
    assert "created_at" in data
    assert "updated_at" in data

def test_create_task_empty_title_returns_400():
    # Empty title
    response = client.post("/api/tasks", json={"title": "   ", "description": "Empty title test"})
    assert response.status_code == 400
    data = response.json()
    assert "detail" in data

    # Missing title field
    response_missing = client.post("/api/tasks", json={"description": "Missing title"})
    assert response_missing.status_code == 400

def test_get_all_tasks():
    # Create 2 tasks
    client.post("/api/tasks", json={"title": "Task 1"})
    client.post("/api/tasks", json={"title": "Task 2"})

    response = client.get("/api/tasks")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["title"] == "Task 2"  # Newest first by default

def test_filter_tasks_by_status():
    t1 = client.post("/api/tasks", json={"title": "Task 1"}).json()
    t2 = client.post("/api/tasks", json={"title": "Task 2"}).json()
    client.patch(f"/api/tasks/{t1['id']}/toggle")

    # Get completed
    res_completed = client.get("/api/tasks?status=completed")
    assert res_completed.status_code == 200
    completed_data = res_completed.json()
    assert len(completed_data) == 1
    assert completed_data[0]["id"] == t1["id"]

    # Get pending
    res_pending = client.get("/api/tasks?status=pending")
    assert res_pending.status_code == 200
    pending_data = res_pending.json()
    assert len(pending_data) == 1
    assert pending_data[0]["id"] == t2["id"]

def test_toggle_task_status():
    create_res = client.post("/api/tasks", json={"title": "Toggle Me"})
    task_id = create_res.json()["id"]

    # Toggle to completed
    patch_res = client.patch(f"/api/tasks/{task_id}/toggle")
    assert patch_res.status_code == 200
    assert patch_res.json()["status"] == "completed"

    # Toggle back to pending
    patch_res_2 = client.patch(f"/api/tasks/{task_id}/toggle")
    assert patch_res_2.status_code == 200
    assert patch_res_2.json()["status"] == "pending"

def test_update_task():
    create_res = client.post("/api/tasks", json={"title": "Original Title", "description": "Original Desc"})
    task_id = create_res.json()["id"]

    update_payload = {
        "title": "Updated Title",
        "description": "Updated Desc",
        "status": "completed",
    }
    put_res = client.put(f"/api/tasks/{task_id}", json=update_payload)
    assert put_res.status_code == 200
    updated_data = put_res.json()
    assert updated_data["title"] == "Updated Title"
    assert updated_data["description"] == "Updated Desc"
    assert updated_data["status"] == "completed"

def test_update_task_empty_title_returns_400():
    create_res = client.post("/api/tasks", json={"title": "Valid Task"})
    task_id = create_res.json()["id"]

    bad_put = client.put(f"/api/tasks/{task_id}", json={"title": "   "})
    assert bad_put.status_code == 400

def test_delete_task():
    create_res = client.post("/api/tasks", json={"title": "Task to Delete"})
    task_id = create_res.json()["id"]

    del_res = client.delete(f"/api/tasks/{task_id}")
    assert del_res.status_code == 200
    assert del_res.json()["id"] == task_id

    # Verify task is deleted
    get_res = client.get(f"/api/tasks/{task_id}")
    assert get_res.status_code == 404

def test_nonexistent_task_returns_404():
    res = client.get("/api/tasks/99999")
    assert res.status_code == 404

    toggle_res = client.patch("/api/tasks/99999/toggle")
    assert toggle_res.status_code == 404

    delete_res = client.delete("/api/tasks/99999")
    assert delete_res.status_code == 404
