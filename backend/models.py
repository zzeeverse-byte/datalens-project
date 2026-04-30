from pydantic import BaseModel
from typing import Any, Optional

class HealthResponse(BaseModel):
    status: str

class ApiResponse(BaseModel):
    status: str
    data: Optional[Any] = None
    message: Optional[str] = None
