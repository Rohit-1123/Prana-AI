# PranaAI Decision Intelligence Backend Foundation

This is the production-grade, asynchronous backend foundation for **PranaAI**, an Environmental Intelligence Operating System. It is constructed using FastAPI, SQLAlchemy 2.0 (asyncpg), and Redis, and supports PostGIS spatial models.

---

## 📂 Folder Structure

```text
backend/
├── Dockerfile                  # Application runtime container setup
├── docker-compose.yml          # Multi-service linkage configurations
├── app/
│   ├── api/
│   │   └── v1/                 # API Version 1 Namespace
│   │       └── routers/
│   │           └── health.py   # Heartbeat and version checkers
│   ├── cache/
│   │   └── redis.py            # Async Redis cache connection manager
│   ├── core/
│   │   ├── config/
│   │   │   └── settings.py     # Environment parameters validation
│   │   └── logging/
│   │       └── logger.py       # Loguru settings
│   ├── database/
│   │   └── connection.py       # Asynchronous engine session pools
│   ├── exceptions/
│   │   └── handlers.py         # JSON standard error routers
│   ├── middleware/
│   │   └── logging_middleware.py # Request timers and ID tracing
│   ├── security/
│   │   └── security.py         # Cryptography hashing and JWT tokens
│   ├── utils/
│   │   ├── geo.py              # Geospatial validation checks
│   │   └── datetime.py         # UTC timezone formatters
│   └── main.py                 # Core API setup
└── tests/                      # Pytest suit logs
```

---

## 🔧 Environment Variables Configs

Duplicate `.env.example` to `.env` and fill the variables:

*   `ENVIRONMENT`: `development` | `testing` | `production`
*   `POSTGRES_SERVER`: Host domain
*   `POSTGRES_USER`: Username
*   `POSTGRES_PASSWORD`: Password
*   `POSTGRES_DB`: Target Database
*   `REDIS_HOST`: Redis host name

---

## 🚀 Running Local Deployments

### Using Docker Compose:
```bash
docker compose up --build
```

### Manual development environment:
1. Initialize virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```
2. Launch dev server:
   ```bash
   uvicorn app.main:app --reload
   ```

---

## 🔬 Testing Suite

Execute pytest:
```bash
$env:PYTHONPATH="backend"; python -m pytest backend/tests/
```
