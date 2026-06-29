import time
from collections import defaultdict

_lockouts: dict[str, float] = {}
_attempts: dict[str, list[float]] = defaultdict(list)


def check_rate_limit(key: str, *, max_attempts: int = 8, window_seconds: int = 900) -> bool:
    """Return True if request is allowed."""
    now = time.time()
    locked_until = _lockouts.get(key, 0)
    if now < locked_until:
        return False
    recent = [t for t in _attempts[key] if now - t < window_seconds]
    _attempts[key] = recent
    return len(recent) < max_attempts


def record_failed_attempt(key: str, *, max_attempts: int = 8, lockout_seconds: int = 900) -> None:
    now = time.time()
    _attempts[key].append(now)
    if len(_attempts[key]) >= max_attempts:
        _lockouts[key] = now + lockout_seconds


def clear_attempts(key: str) -> None:
    _attempts.pop(key, None)
    _lockouts.pop(key, None)
