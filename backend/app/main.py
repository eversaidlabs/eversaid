from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.config import get_settings
from app.core_client import CoreAPIClient, CoreAPIError
from app.database import Base, engine
from app import models  # noqa: F401 - Import models to register them with Base
from app.routes.core import router as core_router


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Initialize resources on startup, cleanup on shutdown."""
    # Create database tables
    Base.metadata.create_all(bind=engine)

    # Initialize Core API client
    settings = get_settings()
    app.state.core_api = CoreAPIClient(base_url=settings.CORE_API_URL)

    yield

    # Cleanup: close Core API client
    await app.state.core_api.close()


app = FastAPI(
    title="Eversaid Wrapper API",
    description="Wrapper backend for Eversaid demo - handles sessions, rate limiting, and feedback",
    version="0.1.0",
    lifespan=lifespan,
)

# Register routers
app.include_router(core_router)


# Exception handlers
@app.exception_handler(CoreAPIError)
async def core_api_error_handler(request: Request, exc: CoreAPIError) -> JSONResponse:
    """Convert CoreAPIError to HTTP response."""
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )


@app.get("/health")
async def health() -> dict:
    """Health check endpoint."""
    return {"status": "ok"}
