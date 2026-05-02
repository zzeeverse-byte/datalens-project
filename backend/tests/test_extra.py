from fastapi.testclient import TestClient
from main import app
import os

client = TestClient(app)

def test_upload_non_csv():
    file_path = os.path.join(os.path.dirname(__file__), "dummy.txt")
    with open(file_path, "w") as f:
        f.write("dummy text")
    
    with open(file_path, "rb") as f:
        response = client.post("/api/upload", files={"file": ("dummy.txt", f, "text/plain")})
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "error"
    assert data["message"] == "File must be a CSV"
    
    os.remove(file_path)

def test_profile_internet_boolean():
    file_path = os.path.join(os.path.dirname(__file__), "..", "..", "student-mat.csv")
    with open(file_path, "rb") as f:
        client.post("/api/upload", files={"file": ("student-mat.csv", f, "text/csv")})
    
    response = client.get("/api/profile?table_name=student_mat")
    assert response.status_code == 200
    data = response.json()
    assert "internet" in data
    assert data["internet"]["type"] == "boolean"

def test_grade_by_school_gp_filter():
    file_path = os.path.join(os.path.dirname(__file__), "..", "..", "student-mat.csv")
    with open(file_path, "rb") as f:
        client.post("/api/upload", files={"file": ("student-mat.csv", f, "text/csv")})
        
    response = client.get("/api/charts/grade-by-school?table_name=student_mat&school=GP")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    
    for row in data["data"]:
        assert row["school"] == "GP"
