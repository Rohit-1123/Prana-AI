import re
from difflib import SequenceMatcher
from functools import lru_cache
from typing import List, Optional

import requests

GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search"  # free, keyless, same provider as the air data
NOT_PLACES = {"the", "a", "an", "my", "our", "your", "this", "that", "it", "me", "us", "there", "here", "general", "morning", "evening",
              "afternoon", "night", "day", "week", "weekend", "future", "case", "order", "fact", "particular", "terms", "general"}
_PREP = re.compile(
    r"\b(?:in|at|near|around|for|of|about|from|to)\s+([A-Za-z][A-Za-z .'-]{1,40}?)"
    r"(?=\s+(?:right now|today|tonight|now|tomorrow|currently|please|compared?|safe|good|bad|better|worse)\b|[?.!,;]|$)",
    re.I,
)
_CAPS = re.compile(r"\b([A-Z][a-z]+(?: [A-Z][a-z]+){0,2})\b")
_SENTENCE_STARTERS = {"how", "what", "is", "are", "can", "should", "will", "does", "do", "which", "where", "when", "why", "tell", "give",
                      "show", "i", "ok", "hi", "hello", "please", "compare"}


def candidates(query: str) -> List[str]:
    """Place-name guesses from a question: 'in Pune', 'near Salt Lake', or a capitalised name. Best guesses first."""
    out: List[str] = []
    for m in _PREP.finditer(query):
        out.append(m.group(1).strip(" .'-"))
    for m in _CAPS.finditer(query):
        words = [w for w in m.group(1).split() if w.lower() not in _SENTENCE_STARTERS]
        if words:
            out.append(" ".join(words))
    seen, result = set(), []
    for c in out:
        key = c.lower()
        if len(c) >= 3 and key.split()[0] not in NOT_PLACES and key not in seen:
            seen.add(key)
            result.append(c)
    return result[:3]


@lru_cache(maxsize=256)
def find_place(name: str) -> Optional[dict]:
    """Geocode an Indian place name. Requires the result to resemble the query so 'morning' never becomes a town."""
    try:
        r = requests.get(GEOCODE_URL, params={"name": name, "count": 5, "language": "en", "format": "json"}, timeout=4)
        r.raise_for_status()
        for hit in r.json().get("results") or []:
            if hit.get("country_code") == "IN" and SequenceMatcher(None, name.lower(), hit["name"].lower()).ratio() >= 0.8:
                return {"name": hit["name"], "city": hit.get("admin2") or hit.get("admin1"), "lat": hit["latitude"], "lng": hit["longitude"]}
    except (requests.RequestException, ValueError, KeyError):
        pass
    return None


if __name__ == "__main__":
    assert candidates("How is the air in Pune right now?") == ["Pune"]
    assert candidates("can I jog in the morning?") == []
    assert "Salt Lake" in candidates("is it safe near Salt Lake today") and candidates("What about Jaipur?") == ["Jaipur"]
    print("geocode ok")
