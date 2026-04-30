from fastapi.testclient import TestClient
from backend.main import app
import os

client = TestClient(app)

def test_profile_endpoint():
    # 1. Upload CSV
    file_path = os.path.join(os.path.dirname(__file__), "..", "..", "student-mat.csv")
    with open(file_path, "rb") as f:
        upload_resp = client.post("/api/upload", files={"file": ("student-mat.csv", f, "text/csv")})
    
    assert upload_resp.status_code == 200
    table_name = upload_resp.json()["table_name"]

    # 2. Get profile
    profile_resp = client.get(f"/api/profile?table_name={table_name}")
    assert profile_resp.status_code == 200
    
    data = profile_resp.json()
    
    # Check internet column is boolean
    assert data["internet"]["type"] == "boolean"
    
    # Check G3 column is numeric with min 0 and max 20
    assert data["G3"]["type"] == "numeric"
    assert data["G3"]["min"] == 0
    assert data["G3"]["max"] == 20
    
    # Check school column is categorical with GP and MS
    assert data["school"]["type"] == "categorical"
    assert "GP" in data["school"]["counts"]
    assert "MS" in data["school"]["counts"]
