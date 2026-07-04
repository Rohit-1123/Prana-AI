import uuid
import json
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database.models.models import Report, ReportExport, Location
from app.services.mission_control_service import MissionControlService
from app.exceptions.handlers import APIException
from app.core.logging.logger import logger

class ReportService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.mc_service = MissionControlService(db)

    async def get_templates(self) -> List[Dict[str, Any]]:
        return [
            {
                "id": "daily_summary",
                "name": "Daily Environmental Report",
                "description": "Chronological summary of target ward values.",
                "supported_formats": ["pdf", "csv", "json"],
                "required_parameters": ["location_id"]
            },
            {
                "id": "weekly_trends",
                "name": "Weekly Environmental Report",
                "description": "7-day rolling aggregates and active warnings.",
                "supported_formats": ["pdf", "excel", "json"],
                "required_parameters": ["location_id"]
            }
        ]

    async def generate_report(
        self, user_id: uuid.UUID, report_type: str, location_id: uuid.UUID, export_format: str = "pdf"
    ) -> Dict[str, Any]:
        # Resolve target location
        query = select(Location).filter(Location.id == location_id)
        res = await self.db.execute(query)
        loc = res.scalars().first()
        if not loc:
            raise APIException("Location not found.", status_code=404)

        report = Report(
            id=uuid.uuid4(),
            user_id=user_id,
            report_name=f"{report_type.replace('_', ' ').title()} - {loc.name}",
            report_type=report_type,
            status="completed",
            export_format=export_format,
            location_scope=loc.name
        )
        self.db.add(report)
        await self.db.commit()
        await self.db.refresh(report)

        # Create report export record
        export = ReportExport(
            id=uuid.uuid4(),
            report_id=report.id,
            format_type=export_format,
            status="completed",
            download_url=f"/api/v1/reports/{report.id}/download"
        )
        self.db.add(export)
        await self.db.commit()

        return {
            "report_id": str(report.id),
            "status": report.status,
            "estimated_completion_time": 0
        }

    async def get_preview(self, report_id: uuid.UUID) -> Dict[str, Any]:
        query = select(Report).filter(Report.id == report_id)
        res = await self.db.execute(query)
        report = res.scalars().first()
        if not report:
            raise APIException("Report not found.", status_code=404)

        return {
            "report_id": str(report.id),
            "report_name": report.report_name,
            "executive_summary": "Overall air quality values indicate steady compliance during morning windows with moderate particulate spikes around midday.",
            "aqi_summary": {"average_aqi": 118, "status": "Moderate"},
            "forecast_summary": "Chronological trends imply stable air flow pattern over the coming 48 hours.",
            "recommendations": [
                "Deploy street-sweeping mist trucks.",
                "Divert logistics traffic outside key wards corridors."
            ]
        }

    async def get_download_bytes(self, report_id: uuid.UUID, format_type: str) -> bytes:
        query = select(Report).filter(Report.id == report_id)
        res = await self.db.execute(query)
        report = res.scalars().first()
        if not report:
            raise APIException("Report not found.", status_code=404)

        # Return mock file bytes based on format
        if format_type.lower() == "csv":
            csv_lines = [
                "Timestamp,AQI,Category,PM2.5,PM10",
                f"{datetime.now(timezone.utc).isoformat()},118,Moderate,42.5,78.0"
            ]
            return "\n".join(csv_lines).encode("utf-8")
        elif format_type.lower() == "json":
            data = {
                "report_id": str(report_id),
                "report_name": report.report_name,
                "generated_at": datetime.now(timezone.utc).isoformat(),
                "aqi": 118
            }
            return json.dumps(data, indent=2).encode("utf-8")
        else:
            # Fallback PDF mock bytes
            return b"%PDF-1.4 mock pdf report generation content data stream"

    async def get_history(self, user_id: uuid.UUID) -> List[Dict[str, Any]]:
        query = select(Report).filter(Report.user_id == user_id).order_by(Report.created_at.desc())
        res = await self.db.execute(query)
        reports = res.scalars().all()
        return [
            {
                "id": str(r.id),
                "name": r.report_name,
                "type": r.report_type,
                "status": r.status,
                "format": r.export_format,
                "created_at": r.created_at
            }
            for r in reports
        ]

    async def delete_report(self, report_id: uuid.UUID) -> Dict[str, Any]:
        query = select(Report).filter(Report.id == report_id)
        res = await self.db.execute(query)
        report = res.scalars().first()
        if not report:
            raise APIException("Report not found.", status_code=404)
        await self.db.delete(report)
        await self.db.commit()
        return {"id": str(report_id), "deleted": True}
