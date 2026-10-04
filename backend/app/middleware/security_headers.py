from starlette.middleware.base import BaseHTTPMiddleware
from app.core.config.settings import settings

# The API serves JSON only; /docs and /redoc load Swagger/ReDoc assets from jsDelivr.
API_CSP = (
    "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'; "
    "img-src 'self' data: https://fastapi.tiangolo.com https://cdn.redoc.ly; "
    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com; "
    "font-src https://fonts.gstatic.com; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; "
    "connect-src 'self'; worker-src blob:"
)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """OWASP-recommended response headers for every API response."""

    async def dispatch(self, request, call_next):
        response = await call_next(request)
        h = response.headers
        h.setdefault("Content-Security-Policy", API_CSP)
        h["X-Content-Type-Options"] = "nosniff"
        h["X-Frame-Options"] = "DENY"
        h["Referrer-Policy"] = "strict-origin-when-cross-origin"
        h["Permissions-Policy"] = "camera=(), microphone=(), geolocation=(), payment=()"
        h["Cross-Origin-Opener-Policy"] = "same-origin"
        h["Cross-Origin-Resource-Policy"] = "cross-origin"  # the separately hosted frontend reads this API
        if request.url.path.startswith(("/api/auth", "/api/v1/auth", "/api/v1/users")):
            h["Cache-Control"] = "no-store"
        if settings.ENVIRONMENT != "development":
            h["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains"
        return response
