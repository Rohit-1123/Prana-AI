"""Live data + Copilot endpoints, with Open-Meteo and Groq faked so tests are offline and deterministic."""
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.services import aqi_service
from app.agents import citizen_agent as citizen_module

client = TestClient(app)


def _hours(n=24 * 7):
    # 2 past days + today + 4 forecast days, hourly; "now" is 2026-10-03T00:30 (half-hour offset like IST)
    return [f"2026-10-{1 + i // 24:02d}T{i % 24:02d}:00" for i in range(n)]


class FakeResp:
    def __init__(self, payload):
        self._p = payload

    def raise_for_status(self):
        pass

    def json(self):
        return self._p


GEOCODE_CALLS = []


def fake_get(url, params=None, timeout=None):
    if "geocoding" in url:
        GEOCODE_CALLS.append(params["name"])
        pune = {"name": "Pune", "latitude": 18.5, "longitude": 73.9, "country_code": "IN", "admin2": "Pune"}
        return FakeResp({"results": [pune]} if params["name"].lower() == "pune" else {})
    n = len(str(params["latitude"]).split(","))
    times = _hours()
    if "air-quality" in url:
        one = {"current": {"time": "2026-10-03T00:30"}, "hourly": {"time": times, "pm2_5": [60.0] * len(times), "pm10": [40.0] * len(times)}}
    else:
        one = {
            "current": {"temperature_2m": 31.0, "relative_humidity_2m": 40, "wind_speed_10m": 2.0, "weather_code": 0},
            "hourly": {"time": times, "temperature_2m": [30.0] * len(times), "relative_humidity_2m": [40] * len(times), "wind_speed_10m": [2.0] * len(times)},
        }
    return FakeResp([one] * n if n > 1 else one)


@pytest.fixture(autouse=True)
def fresh(monkeypatch):
    aqi_service._cache.clear()
    from app.core import rate_limit
    rate_limit._hits.clear()
    from app.services import geocode
    geocode.find_place.cache_clear()
    GEOCODE_CALLS.clear()
    monkeypatch.setattr(aqi_service.requests, "get", fake_get)
    monkeypatch.setattr(citizen_module.CitizenAdvisoryAgent, "__init__", lambda self: (setattr(self, "llm", FakeLLM()), setattr(self, "name", "t"))[0])
    import app.routers.chat as chat_router
    monkeypatch.setattr(chat_router, "citizen_agent", citizen_module.CitizenAdvisoryAgent())


class FakeLLM:
    last = None

    def chat(self, messages, max_tokens=700):
        FakeLLM.last = messages
        return None  # force the offline, data-driven reply


def test_live_returns_cpcb_aqi_and_hides_series():
    r = client.post("/api/dashboard/live", json=[{"name": "A", "lat": 17.4, "lng": 78.4}, {"name": "B", "lat": 28.6, "lng": 77.2}])
    assert r.status_code == 200
    a = r.json()["A"]
    assert a["aqi"] == 100 and a["pm2_5"] == 60.0  # 60 µg/m³ PM2.5 -> CPCB 100
    assert a["temperature"] == 31.0 and a["weather_condition"] == "Clear"
    assert [f["horizon_hours"] for f in a["forecast"]] == [24, 48, 72]
    assert "series" not in a and set(r.json()) == {"A", "B"}


def test_series_spans_past_24h_to_next_72h():
    r = client.get("/api/dashboard/series", params={"lat": 17.4, "lng": 78.4})
    assert r.status_code == 200
    rows = r.json()["series"]
    assert len(rows) == 97
    assert sum(1 for x in rows if x["is_forecast"]) == 72 and rows[24]["is_forecast"] is False


def test_live_validates_input():
    assert client.post("/api/dashboard/live", json=[{"name": "x", "lat": 123, "lng": 0}]).status_code == 422
    assert client.get("/api/dashboard/series", params={"lat": 0, "lng": 500}).status_code == 422


def test_copilot_answers_from_live_context_even_without_llm():
    body = {
        "query": "Can I jog?", "language": "en",
        "ward": {"name": "Anand Vihar", "city": "Delhi", "aqi": 254},
        "locations": [{"name": "Saket", "city": "Delhi", "aqi": 190}, {"name": "Bandra", "city": "Mumbai", "aqi": 60}],
    }
    r = client.post("/api/chat/query", json=body)
    assert r.status_code == 200
    d = r.json()
    assert d["air_quality_rating"] == "Poor" and "254" in d["advisory_response"]
    assert [x["name"] for x in d["recommended_clean_routes"]] == ["Saket"]  # other cities excluded


def test_copilot_rejects_bad_input():
    base = {"query": "hi", "ward": {"name": "X", "aqi": 50}}
    assert client.post("/api/chat/query", json={**base, "query": ""}).status_code == 422
    assert client.post("/api/chat/query", json={**base, "language": "xx"}).status_code == 422
    assert client.post("/api/chat/query", json={**base, "query": "a" * 1001}).status_code == 422
    assert client.post("/api/chat/query", json={"query": "hi"}).status_code == 404  # no ward, no ward_id


def test_copilot_is_rate_limited():
    body = {"query": "hi", "ward": {"name": "X", "aqi": 50}}
    codes = [client.post("/api/chat/query", json=body).status_code for _ in range(21)]
    assert codes[:20] == [200] * 20 and codes[20] == 429


def test_security_headers_present():
    h = client.get("/").headers
    assert h["x-frame-options"] == "DENY" and h["x-content-type-options"] == "nosniff"
    assert "frame-ancestors 'none'" in h["content-security-policy"]


def test_cors_allows_dev_origin_and_blocks_others():
    ok = client.options("/api/dashboard/live", headers={"Origin": "http://localhost:5199", "Access-Control-Request-Method": "POST"})
    bad = client.options("/api/dashboard/live", headers={"Origin": "https://evil.example", "Access-Control-Request-Method": "POST"})
    assert ok.headers.get("access-control-allow-origin") == "http://localhost:5199"
    assert "access-control-allow-origin" not in bad.headers


BODY = {
    "language": "en",
    "ward": {"name": "Anand Vihar", "city": "Delhi", "aqi": 254},
    "locations": [
        {"name": "Saket", "city": "Delhi", "aqi": 250},
        {"name": "Bandra", "city": "Mumbai", "aqi": 60, "pm2_5": 21.5},
    ],
}


def _context_for(query):
    r = client.post("/api/chat/query", json={**BODY, "query": query})
    assert r.status_code == 200
    return r, next(m["content"] for m in FakeLLM.last if m["content"].startswith("Focus location"))


def test_copilot_gives_full_readings_for_a_named_other_city():
    _, ctx = _context_for("how is mumbai today?")
    assert "Bandra" in ctx.split("Places the user asked about")[1] and "PM2.5 21.5" in ctx


def test_copilot_tolerates_typos_and_case():
    for q in ("how is MUMBAY today", "is bandra safe?"):
        _, ctx = _context_for(q)
        assert "PM2.5 21.5" in ctx, q


def test_copilot_does_not_add_unasked_cities():
    _, ctx = _context_for("Can I jog?")
    assert ctx.split("Places the user asked about")[1].split("Other cities")[0].strip().endswith("- none")


def test_copilot_ignores_trivially_cleaner_places():
    r, _ = _context_for("Can I jog?")
    assert r.json()["recommended_clean_routes"] == []  # Saket is only 4 points cleaner


def test_copilot_looks_up_a_place_it_has_no_reading_for():
    r, ctx = _context_for("how is the air in Pune right now?")
    assert GEOCODE_CALLS == ["Pune"]
    assert "Pune (Pune), AQI 100" in ctx.split("Places the user asked about")[1]


def test_copilot_does_not_geocode_known_places_or_non_places():
    _context_for("how is Mumbai?")
    _context_for("can I jog in the morning?")
    assert GEOCODE_CALLS == []


def test_copilot_survives_an_unknown_place():
    r, ctx = _context_for("how is the air in Atlantis?")
    assert r.status_code == 200 and ctx.split("Places the user asked about")[1].split("Other cities")[0].strip().endswith("- none")
