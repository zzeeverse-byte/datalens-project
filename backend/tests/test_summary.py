from fastapi.testclient import TestClient
from backend.main import app
import os

client = TestClient(app)

def test_summary():
    if not os.getenv("GEMINI_API_KEY"):
        print("Skipping summary test because GEMINI_API_KEY is not set.")
        return

    # 1. Upload CSV
    file_path = os.path.join(os.path.dirname(__file__), "..", "..", "student-mat.csv")
    with open(file_path, "rb") as f:
        upload_resp = client.post("/api/upload", files={"file": ("student-mat.csv", f, "text/csv")})
    
    assert upload_resp.status_code == 200
    table_name = upload_resp.json()["table_name"]

    # 2. Test summary endpoint
    resp = client.post("/api/summary", json={"table_name": table_name})
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    text = data["response"].lower()
    print("RESPONSE TEXT:", text)
    
    assert len(text) > 0
    assert any(char.isdigit() for char in text), "Summary should contain actual numbers"
    
    # Verify it references generic concepts from the data
    keywords = ["average", "grade", "school", "g3", "student"]
    assert any(keyword in text for keyword in keywords), "Summary should reference the dataset contents"
