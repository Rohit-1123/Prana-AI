import time
from collections import defaultdict, deque
from fastapi import HTTPException, Request

# ponytail: per-process sliding window keyed by client IP; move to Redis when running several workers
_hits: dict = defaultdict(deque)


def rate_limit(max_requests: int, window_s: int):
    """FastAPI dependency: allow `max_requests` per `window_s` seconds per client IP and route."""
    def dependency(request: Request):
        key = (request.client.host if request.client else "unknown", request.url.path)
        now = time.monotonic()
        hits = _hits[key]
        while hits and now - hits[0] > window_s:
            hits.popleft()
        if len(hits) >= max_requests:
            retry = int(window_s - (now - hits[0])) + 1
            raise HTTPException(status_code=429, detail="Too many requests, please slow down.", headers={"Retry-After": str(retry)})
        hits.append(now)
    return dependency


if __name__ == "__main__":
    from types import SimpleNamespace
    dep = rate_limit(2, 60)
    req = SimpleNamespace(client=SimpleNamespace(host="1.2.3.4"), url=SimpleNamespace(path="/x"))
    dep(req); dep(req)
    try:
        dep(req)
        raise AssertionError("third call should be limited")
    except HTTPException as e:
        assert e.status_code == 429
    print("rate_limit ok")
