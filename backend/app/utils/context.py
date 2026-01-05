"""
Context variables for request tracing.

These contextvars are automatically included in all log messages when set.
They are set by middleware and available throughout the request lifecycle.
"""
from contextvars import ContextVar
from typing import Optional

# Request-scoped context variables
request_id: ContextVar[Optional[str]] = ContextVar("request_id", default=None)
session_id: ContextVar[Optional[str]] = ContextVar("session_id", default=None)


def get_context_fields() -> dict:
    """
    Get current context fields for logging.

    Returns:
        Dictionary of context fields that are currently set.
        Only includes fields with non-None values.
    """
    fields = {}
    if (rid := request_id.get()) is not None:
        fields["request_id"] = rid
    if (sid := session_id.get()) is not None:
        fields["session_id"] = sid
    return fields


def clear_context() -> None:
    """
    Clear all context variables.

    Called at the end of request processing to prevent context leakage.
    """
    request_id.set(None)
    session_id.set(None)
