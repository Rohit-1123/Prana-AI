import pandas as pd
from app.core.llm import LLMClient

class ReportGenerationAgent:
    def __init__(self):
        self.name = "Report Generation Agent"
        self.llm = LLMClient()

    def generate_analytical_report(self, database_records: list, report_type: str = "Weekly") -> dict:
        """
        Processes database history, builds comparison metrics, and calls LLM to write an analytical executive summary.
        """
        if not database_records:
            return {
                "title": f"{report_type} Environmental Intelligence Report",
                "summary": "No historical data available in database to compile report.",
                "wards_summary": []
            }
            
        # Convert records to list of dicts if they are database objects
        df_records = []
        for r in database_records:
            df_records.append({
                "ward": r.ward.name if hasattr(r, "ward") else r.get("ward"),
                "aqi": r.aqi,
                "pm2_5": r.pm2_5,
                "pm10": r.pm10,
                "traffic_congestion": r.traffic_congestion,
                "industrial_emissions": r.industrial_emissions,
                "construction_activity": r.construction_activity
            })
            
        df = pd.DataFrame(df_records)
        
        # Calculate summaries per ward
        summary_stats = df.groupby("ward").agg({
            "aqi": ["mean", "max", "min"],
            "pm2_5": "mean",
            "traffic_congestion": "mean",
            "industrial_emissions": "mean",
            "construction_activity": "mean"
        })
        
        summary_stats.columns = [
            "avg_aqi", "max_aqi", "min_aqi", "avg_pm2_5", "avg_traffic", "avg_industry", "avg_construction"
        ]
        summary_stats = summary_stats.round(1).reset_index()
        
        ward_summaries = summary_stats.to_dict(orient="records")
        
        # Prepare list for prompt
        prompt_data = []
        for w in ward_summaries:
            prompt_data.append(
                f"Ward: {w['ward']}, Avg AQI: {w['avg_aqi']} (Range: {w['min_aqi']}-{w['max_aqi']}), Avg Traffic: {w['avg_traffic']}%, Avg Industry: {w['avg_industry']}%, Avg Construction: {w['avg_construction']}%"
            )
            
        prompt = f"""
        You are PranaAI's Report Generation Agent. Compile a formal municipal report.
        Report Type: {report_type} Summary
        Data aggregates for the period:
        {chr(10).join(prompt_data)}
        
        Write a professional Executive Summary highlighting the primary environmental bottlenecks, ward compliance issues, traffic hot-spots, and concrete suggestions for the coming week.
        Format with beautiful markdown headings.
        """
        
        system_instruction = "You are PranaAI's Report Generation Agent, producing boardroom-ready environmental audits for city mayors and administrators."
        summary_text = self.llm.generate_text(prompt, system_instruction)
        
        return {
            "title": f"PranaAI {report_type} Environmental Performance Report",
            "compiled_at": pd.Timestamp.now().isoformat(),
            "report_type": report_type,
            "wards_summary": ward_summaries,
            "executive_summary": summary_text
        }
