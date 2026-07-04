class IntentDetector:
    def detect_intent(self, question: str) -> str:
        q = question.lower()
        if "forecast" in q or "predict" in q or "tomorrow" in q or "timeline" in q:
            return "forecast"
        if "compare" in q or "difference" in q or "versus" in q or "vs" in q:
            return "compare"
        if "hotspot" in q or "polluted" in q or "highest" in q:
            return "hotspots"
        return "general"
