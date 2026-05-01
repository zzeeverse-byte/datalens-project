from fastapi.testclient import TestClient
from main import app
import os

client = TestClient(app)

def test_chart_endpoints():
    # 1. Upload CSV
    file_path = os.path.join(os.path.dirname(__file__), "..", "..", "student-mat.csv")
    with open(file_path, "rb") as f:
        upload_resp = client.post("/api/upload", files={"file": ("student-mat.csv", f, "text/csv")})
    
    assert upload_resp.status_code == 200
    table_name = upload_resp.json()["table_name"]

    # 2. Test endpoints
    endpoints = [
        "/api/charts/grade-by-school",
        "/api/charts/studytime-vs-grade",
        "/api/charts/internet-vs-grade",
        "/api/charts/absences-vs-grade",
        "/api/charts/parent-education-vs-grade"
    ]
    
    for endpoint in endpoints:
        resp = client.get(f"{endpoint}?table_name={table_name}")
        assert resp.status_code == 200
        data = resp.json()["data"]
        assert len(data) > 0
