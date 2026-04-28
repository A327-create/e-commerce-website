from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.api.v1 import (
    auth_routes,
    product_routes,
    cart_routes,
    order_routes,
)
from app.api.v1.profile_routes import router as profile_routes
from app.api.v1 import review_routes
from app.api.v1 import favorite_routes
from app.api.v1 import message_routes

@asynccontextmanager
async def lifespan(app: FastAPI):
    #startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()
app = FastAPI(
    title=settings.APP_NAME,
    # version=settings.APP_VERSION,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan,
)
app.include_router(auth_routes.router, prefix="/api/v1")
app.include_router(product_routes.router, prefix="/api/v1")
app.include_router(cart_routes.router, prefix="/api/v1")
app.include_router(order_routes.router, prefix="/api/v1")
app.include_router(profile_routes, prefix="/api/v1")
app.include_router(review_routes.router, prefix="/api/v1")
app.include_router(favorite_routes.router, prefix="/api/v1")
app.include_router(message_routes.router, prefix="/api/v1")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        # "https://your-frontend.vercel.app"  
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/health")
async def health_check():
    return {"status": "ok"}