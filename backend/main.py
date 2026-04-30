from fastapi import FastAPI, UploadFile, File, Query
from typing import Optional
from backend.csv_service import parse_csv, store_csv_in_sqlite
from backend.chat_service import chat_with_data, generate_executive_summary
from backend.models import ChatRequest, SummaryRequest
from backend.data_service import (
    profile_dataframe,
    get_avg_grade_by_school,
    get_studytime_vs_grade,
    get_internet_vs_grade,
    get_absences_vs_grade,
    get_parent_education_vs_grade
)
from backend.database import get_db_connection
import pandas as pd
import tempfile
import os

app = FastAPI()

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

@app.post("/api/upload")
async def upload_csv(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        return {"status": "error", "message": "File must be a CSV"}
    
    try:
        # Save the uploaded file to a temporary location
        with tempfile.NamedTemporaryFile(delete=False, suffix=".csv") as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        # Parse CSV
        df = parse_csv(tmp_path)
        
        # Store in SQLite, using the filename without extension as the table name
        table_name = os.path.splitext(file.filename)[0]
        table_name = table_name.replace('-', '_').replace(' ', '_')
        store_csv_in_sqlite(df, table_name)
        
        # Clean up temp file
        os.remove(tmp_path)
        
        return {
            "table_name": table_name,
            "row_count": len(df),
            "columns": df.columns.tolist()
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/api/profile")
def get_profile(table_name: str):
    conn = get_db_connection()
    try:
        df = pd.read_sql(f"SELECT * FROM {table_name}", conn)
        conn.close()
        profile = profile_dataframe(df)
        return profile
    except Exception as e:
        conn.close()
        return {"status": "error", "message": str(e)}

@app.post("/api/chat")
def api_chat(req: ChatRequest):
    try:
        response_text = chat_with_data(req.message, req.table_name)
        return {"status": "success", "response": response_text}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/api/summary")
def api_summary(req: SummaryRequest):
    try:
        summary_text = generate_executive_summary(req.table_name)
        return {"status": "success", "response": summary_text}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/api/charts/grade-by-school")
def api_grade_by_school(table_name: str, school: Optional[str] = None, sex: Optional[str] = None, internet: Optional[str] = None):
    filters = {k: v for k, v in {"school": school, "sex": sex, "internet": internet}.items() if v is not None}
    return {"status": "success", "data": get_avg_grade_by_school(table_name, filters)}

@app.get("/api/charts/studytime-vs-grade")
def api_studytime_vs_grade(table_name: str, school: Optional[str] = None, sex: Optional[str] = None, internet: Optional[str] = None):
    filters = {k: v for k, v in {"school": school, "sex": sex, "internet": internet}.items() if v is not None}
    return {"status": "success", "data": get_studytime_vs_grade(table_name, filters)}

@app.get("/api/charts/internet-vs-grade")
def api_internet_vs_grade(table_name: str, school: Optional[str] = None, sex: Optional[str] = None, internet: Optional[str] = None):
    filters = {k: v for k, v in {"school": school, "sex": sex, "internet": internet}.items() if v is not None}
    return {"status": "success", "data": get_internet_vs_grade(table_name, filters)}

@app.get("/api/charts/absences-vs-grade")
def api_absences_vs_grade(table_name: str, school: Optional[str] = None, sex: Optional[str] = None, internet: Optional[str] = None):
    filters = {k: v for k, v in {"school": school, "sex": sex, "internet": internet}.items() if v is not None}
    return {"status": "success", "data": get_absences_vs_grade(table_name, filters)}

@app.get("/api/charts/parent-education-vs-grade")
def api_parent_education_vs_grade(table_name: str, school: Optional[str] = None, sex: Optional[str] = None, internet: Optional[str] = None):
    filters = {k: v for k, v in {"school": school, "sex": sex, "internet": internet}.items() if v is not None}
    return {"status": "success", "data": get_parent_education_vs_grade(table_name, filters)}
