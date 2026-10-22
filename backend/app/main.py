from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from app.config import CORS_ORIGINS
from app.database import init_db
from app.routes.task import router as task_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on startup
    init_db()
    yield

app = FastAPI(
    title="Task-Flow API",
    description="RESTful API for Task-Flow Personal Task Manager",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration to allow React frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Override default 422 validation error to return 400 Bad Request as required by assignment specification
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    error_messages = []
    for err in errors:
        loc = " -> ".join(str(l) for l in err.get("loc", []))
        msg = err.get("msg", "Invalid input")
        error_messages.append(f"{loc}: {msg}")
    
    first_error = error_messages[0] if error_messages else "Invalid input"
    
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "detail": first_error,
            "errors": error_messages,
            "message": "Validation failed: " + "; ".join(error_messages),
        },
    )

# Root & Health check
@app.get("/", tags=["Health"])
def root():
    return {
        "app": "Task-Flow API",
        "status": "online",
        "documentation": "/docs",
    }

@app.get("/api/health", tags=["Health"])
def health_check():
    return {"status": "ok"}

# Register task router
app.include_router(task_router)

