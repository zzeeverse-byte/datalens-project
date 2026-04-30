from fastapi.testclient import TestClient
from backend.main import app
import os
from unittest.mock import patch

client = TestClient(app)

@patch('backend.chat_service.genai.GenerativeModel')
def test_chat(mock_model):
    mock_instance = mock_model.return_value
    mock_chat = mock_instance.start_chat.return_value
    mock_response = mock_chat.send_message.return_value
    mock_response.text = "The average grade for school GP is 15."

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
