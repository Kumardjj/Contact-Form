from fastapi import Request
from slowapi import Limiter
from slowapi.util import get_remote_address


def get_form_visitor_key(request: Request) -> str:
    # Approximate visitor identity using their IP
    visitor_ip = get_remote_address(request)

    # Keep a separate limit for each public form
    public_id = request.path_params.get(
        "public_id",
        "unknown"
    )

    return f"{visitor_ip}:{public_id}"


limiter = Limiter(
    key_func=get_form_visitor_key,
    storage_uri="memory://"
)