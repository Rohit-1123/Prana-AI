import time
import uuid
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.logging.logger import logger

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        # Generate custom unique Request ID
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        
        # Track start time
        start_time = time.time()
        
        # Logs query details
        logger.info(f"[{request_id}] START: {request.method} {request.url.path}")

        try:
            response = await call_next(request)
        except Exception as e:
            duration = (time.time() - start_time) * 1000
            logger.error(f"[{request_id}] FAILED: {request.method} {request.url.path} after {duration:.2f}ms - Exception: {e}")
            raise
        
        duration = (time.time() - start_time) * 1000
        logger.info(f"[{request_id}] FINISH: {request.method} {request.url.path} - Status: {response.status_code} in {duration:.2f}ms")

        # Inject Request ID header
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Response-Time-Ms"] = f"{duration:.2f}"
        
        return response
