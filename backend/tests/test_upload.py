from fastapi.testclient import TestClient
from backend.main import app
import os

client = TestClient(app)

def test_upload_csv():
    file_path = os.path.join(os.path.dirname(__file__), "..", "..", "student-mat.csv")
    with open(file_path, "rb") as f:
        response = client.post("/api/upload", files={"file": ("student-mat.csv", f, "text/csv")})
    
    assert response.status_code == 200
    data = response.json()
    assert data["row_count"] == 395
    assert "G3" in data["columns"]
    assert "studytime" in data["columns"]
    assert data["table_name"] == "student_mat"
