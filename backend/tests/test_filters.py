from fastapi.testclient import TestClient
from main import app
import os

client = TestClient(app)

def test_chart_filters():
    # 1. Upload CSV
    file_path = os.path.join(os.path.dirname(__file__), "..", "..", "student-mat.csv")
    with open(file_path, "rb") as f:
        upload_resp = client.post("/api/upload", files={"file": ("student-mat.csv", f, "text/csv")})
    
    assert upload_resp.status_code == 200
    table_name = upload_resp.json()["table_name"]

    # 2. Get absences without filter
    resp_all = client.get(f"/api/charts/absences-vs-grade?table_name={table_name}")
    assert resp_all.status_code == 200
    data_all = resp_all.json()["data"]

    # 3. Get absences with school=GP filter
    resp_gp = client.get(f"/api/charts/absences-vs-grade?table_name={table_name}&school=GP")
    assert resp_gp.status_code == 200
    data_gp = resp_gp.json()["data"]
    
    # 4. Get absences with school=MS filter
    resp_ms = client.get(f"/api/charts/absences-vs-grade?table_name={table_name}&school=MS")
    assert resp_ms.status_code == 200
    data_ms = resp_ms.json()["data"]

    # The total data should be larger than the filtered subsets
    assert len(data_all) > len(data_gp)
    assert len(data_gp) > 0
    assert len(data_all) == (len(data_gp) + len(data_ms))

    # Also test grade by school. If filtered by GP, the result should only have GP
    resp_gp_school = client.get(f"/api/charts/grade-by-school?table_name={table_name}&school=GP")
    assert resp_gp_school.status_code == 200
    data_gp_school = resp_gp_school.json()["data"]
    assert len(data_gp_school) == 1
    assert data_gp_school[0]["school"] == "GP"

def test_get_dynamic_filters():
    # 1. Upload CSV
    file_path = os.path.join(os.path.dirname(__file__), "..", "..", "student-mat.csv")
    with open(file_path, "rb") as f:
        upload_resp = client.post("/api/upload", files={"file": ("student-mat.csv", f, "text/csv")})
    
    assert upload_resp.status_code == 200
    table_name = upload_resp.json()["table_name"]

    # 2. Call /api/filters
    resp = client.get(f"/api/filters?table_name={table_name}")
    assert resp.status_code == 200
    filters = resp.json()["filters"]
    
    # 3. Verify structure of response
    assert len(filters) > 0
    # ensure 'school' is one of the returned columns, and it has options 'GP', 'MS'
    school_filter = next((f for f in filters if f["column"] == "school"), None)
    assert school_filter is not None
    assert set(school_filter["options"]) == {"GP", "MS"}
