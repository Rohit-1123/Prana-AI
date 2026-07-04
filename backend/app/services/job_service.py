import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from app.exceptions.handlers import APIException

# Simulated background worker ledger
_JOBS_LEDGER: List[Dict[str, Any]] = [
    {
        "id": "job_01a2b3c4-5678-90ab-cdef-1234567890ab",
        "name": "Refresh AQI Telemetry",
        "status": "completed",
        "queue": "high",
        "retry_count": 0,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "completed_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "job_02b3c4d5-6789-0abc-def1-2345678901bc",
        "name": "Cleanup Expired Sessions",
        "status": "failed",
        "queue": "low",
        "retry_count": 2,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "error": "Redis connection timeout"
    }
]

class BackgroundJobService:
    async def list_jobs(self) -> List[Dict[str, Any]]:
        return _JOBS_LEDGER

    async def get_job(self, job_id: str) -> Dict[str, Any]:
        for job in _JOBS_LEDGER:
            if job["id"] == job_id:
                return job
        raise APIException("Job not found.", status_code=404)

    async def cancel_job(self, job_id: str) -> Dict[str, Any]:
        for job in _JOBS_LEDGER:
            if job["id"] == job_id:
                job["status"] = "cancelled"
                return {"id": job_id, "status": "cancelled"}
        raise APIException("Job not found.", status_code=404)

    async def retry_job(self, job_id: str) -> Dict[str, Any]:
        for job in _JOBS_LEDGER:
            if job["id"] == job_id:
                job["status"] = "retrying"
                job["retry_count"] += 1
                return {"id": job_id, "status": "retrying", "retry_count": job["retry_count"]}
        raise APIException("Job not found.", status_code=404)
