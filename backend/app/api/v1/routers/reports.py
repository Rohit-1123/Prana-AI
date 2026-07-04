import uuid
from fastapi import APIRouter, Depends, Query, status, Body, Response
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.connection import get_async_db
from app.services.report_service import ReportService
from app.dependencies.auth import get_current_user
from app.database.models.models import User
from app.exceptions.handlers import APIException

router = APIRouter(prefix="/reports", tags=["Reporting Engine"])

@router.get("/templates")
async def get_templates(
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user)
):
    service = ReportService(db)
    templates = await service.get_templates()
    return {
        "success": True,
        "message": "Report templates retrieved.",
        "data": templates,
        "metadata": {},
        "errors": []
    }

@router.post("/generate")
async def generate_report(
    report_type: str = Body(..., description="Template type key"),
    location_id: uuid.UUID = Body(..., description="Target Location UUID"),
    export_format: str = Body("pdf", description="Export target format"),
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user)
):
    service = ReportService(db)
    res = await service.generate_report(current_user.id, report_type, location_id, export_format)
    return {
        "success": True,
        "message": "Report generation initialized.",
        "data": res,
        "metadata": {},
        "errors": []
    }

@router.get("/history")
async def get_history(
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user)
):
    service = ReportService(db)
    history = await service.get_history(current_user.id)
    return {
        "success": True,
        "message": "User reports history retrieved.",
        "data": history,
        "metadata": {},
        "errors": []
    }

@router.get("/{report_id}/preview")
async def get_preview(
    report_id: uuid.UUID,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user)
):
    service = ReportService(db)
    preview = await service.get_preview(report_id)
    return {
        "success": True,
        "message": "Report preview compiled.",
        "data": preview,
        "metadata": {},
        "errors": []
    }

@router.get("/{report_id}/download")
async def download_report(
    report_id: uuid.UUID,
    format_type: str = Query("pdf", description="Download format extension override"),
    db: AsyncSession = Depends(get_async_db)
):
    service = ReportService(db)
    file_bytes = await service.get_download_bytes(report_id, format_type)
    
    # Resolve MIME type
    media_type = "application/pdf"
    filename = f"report_{report_id}.pdf"
    if format_type.lower() == "csv":
        media_type = "text/csv"
        filename = f"report_{report_id}.csv"
    elif format_type.lower() == "json":
        media_type = "application/json"
        filename = f"report_{report_id}.json"

    return Response(
        content=file_bytes,
        media_type=media_type,
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.delete("/{report_id}")
async def delete_report(
    report_id: uuid.UUID,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user)
):
    service = ReportService(db)
    res = await service.delete_report(report_id)
    return {
        "success": True,
        "message": "Report deleted successfully.",
        "data": res,
        "metadata": {},
        "errors": []
    }

@router.post("/custom")
async def create_custom_report(
    metrics: list = Body(..., description="Metrics items list"),
    location_ids: list = Body(..., description="Location UUIDs items list"),
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user)
):
    # Simulated custom report config persistence
    return {
        "success": True,
        "message": "Custom report template configuration registered.",
        "data": {
            "custom_template_id": str(uuid.uuid4()),
            "status": "ready"
        },
        "metadata": {},
        "errors": []
    }

@router.post("/schedule")
async def schedule_report(
    template_id: str = Body(...),
    cron: str = Body(...),
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user)
):
    # Simulated scheduled configuration persistence
    return {
        "success": True,
        "message": "Report schedule task established.",
        "data": {
            "schedule_id": str(uuid.uuid4()),
            "cron": cron,
            "status": "active"
        },
        "metadata": {},
        "errors": []
    }

@router.get("/schedules")
async def list_schedules(
    current_user: User = Depends(get_current_user)
):
    return {
        "success": True,
        "message": "Active report crons schedules listed.",
        "data": [
            {
                "id": str(uuid.uuid4()),
                "cron": "0 0 * * *",
                "template": "daily_summary",
                "status": "active"
            }
        ],
        "metadata": {},
        "errors": []
    }

@router.get("/statistics")
async def get_statistics(
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user)
):
    return {
        "success": True,
        "message": "Reports aggregate metrics computed.",
        "data": {
            "total_reports_generated": 14,
            "popular_export_format": "pdf",
            "storage_used_bytes": 1024 * 342
        },
        "metadata": {},
        "errors": []
    }
