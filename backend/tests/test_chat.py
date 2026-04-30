from fastapi.testclient import TestClient
from backend.main import app
import os

client = TestClient(app)

def test_chat():
    if not os.getenv("GEMINI_API_KEY"):
        print("Skipping chat test because GEMINI_API_KEY is not set.")
        return

    # 1. Upload CSV
    file_path = os.path.join(os.path.dirname(__file__), "..", "..", "student-mat.csv")
    with open(file_path, "rb") as f:
        upload_resp = client.post("/api/upload", files={"file": ("student-mat.csv", f, "text/csv")})
    
    assert upload_resp.status_code == 200
    table_name = upload_resp.json()["table_name"]

    # 2. Test chat endpoint
    questions = [
        "What is the average final grade by school?",
        "Do students with internet access perform better?"
    ]
    
    for q in questions:
        resp = client.post("/api/chat", json={"message": q, "table_name": table_name})
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "success"
        assert "response" in data
        assert len(data["response"]) > 0
        assert any(char.isdigit() for char in data["response"]), "Response should contain actual numbers"
