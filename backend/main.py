from fastapi import FastAPI, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from csv_service import parse_csv, store_csv_in_sqlite
from chat_service import chat_with_data, generate_executive_summary
from models import ChatRequest, SummaryRequest
from data_service import (
    profile_dataframe,
    get_avg_grade_by_school,
    get_studytime_vs_grade,
    get_internet_vs_grade,
    get_absences_vs_grade,
    get_parent_education_vs_grade,
    get_generic_charts,
    get_dynamic_filters
)
from database import get_db_connection
import pandas as pd
import tempfile
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

@app.post("/api/upload")
async def upload_csv(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        return {"status": "error", "message": "File must be a CSV"}
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".csv") as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name
        df = parse_csv(tmp_path)
        table_name = os.path.splitext(file.filename)[0]
        table_name = table_name.replace('-', '_').replace(' ', '_')
        store_csv_in_sqlite(df, table_name)
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
def api_grade_by_school(request: Request, table_name: str):
    filters = {k: v for k, v in request.query_params.items() if k != "table_name" and v is not None and v != "All"}
    return {"status": "success", "data": get_avg_grade_by_school(table_name, filters)}

@app.get("/api/charts/studytime-vs-grade")
def api_studytime_vs_grade(request: Request, table_name: str):
    filters = {k: v for k, v in request.query_params.items() if k != "table_name" and v is not None and v != "All"}
    return {"status": "success", "data": get_studytime_vs_grade(table_name, filters)}

@app.get("/api/charts/internet-vs-grade")
def api_internet_vs_grade(request: Request, table_name: str):
    filters = {k: v for k, v in request.query_params.items() if k != "table_name" and v is not None and v != "All"}
    return {"status": "success", "data": get_internet_vs_grade(table_name, filters)}

@app.get("/api/charts/absences-vs-grade")
def api_absences_vs_grade(request: Request, table_name: str):
    filters = {k: v for k, v in request.query_params.items() if k != "table_name" and v is not None and v != "All"}
    return {"status": "success", "data": get_absences_vs_grade(table_name, filters)}

@app.get("/api/charts/parent-education-vs-grade")
def api_parent_education_vs_grade(request: Request, table_name: str):
    filters = {k: v for k, v in request.query_params.items() if k != "table_name" and v is not None and v != "All"}
    return {"status": "success", "data": get_parent_education_vs_grade(table_name, filters)}

@app.get("/api/charts/generic")
def api_generic_charts(request: Request, table_name: str):
    filters = {k: v for k, v in request.query_params.items() if k != "table_name" and v is not None and v != "All"}
    try:
        charts = get_generic_charts(table_name, filters)
        return {"status": "success", "charts": charts}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/api/filters")
def api_filters(table_name: str):
    try:
        filters = get_dynamic_filters(table_name)
        return {"status": "success", "filters": filters}
    except Exception as e:
        return {"status": "error", "message": str(e)}