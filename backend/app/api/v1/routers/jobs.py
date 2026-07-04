from fastapi import APIRouter, Depends
from app.services.job_service import BackgroundJobService
from app.dependencies.auth import get_current_user
from app.database.models.models import User
from app.exceptions.handlers import APIException

router = APIRouter(prefix="/jobs", tags=["Background Jobs Management"])

def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "Administrator":
        raise APIException("Only administrators can manage jobs.", status_code=403)

@router.get("", dependencies=[Depends(require_admin)])
async def list_jobs():
    service = BackgroundJobService()
    res = await service.list_jobs()
    return {
        "success": True,
        "message": "Background tasks listed.",
        "data": res,
        "metadata": {},
        "errors": []
    }

@router.get("/{job_id}", dependencies=[Depends(require_admin)])
async def get_job(job_id: str):
    service = BackgroundJobService()
    res = await service.get_job(job_id)
    return {
        "success": True,
        "message": "Job details resolved.",
        "data": res,
        "metadata": {},
        "errors": []
    }

@router.delete("/{job_id}", dependencies=[Depends(require_admin)])
async def cancel_job(job_id: str):
    service = BackgroundJobService()
    res = await service.cancel_job(job_id)
    return {
        "success": True,
        "message": "Job cancelled.",
        "data": res,
        "metadata": {},
        "errors": []
    }

@router.post("/retry/{job_id}", dependencies=[Depends(require_admin)])
async def retry_job(job_id: str):
    service = BackgroundJobService()
    res = await service.retry_job(job_id)
    return {
        "success": True,
        "message": "Job retry triggered.",
        "data": res,
        "metadata": {},
        "errors": []
    }
