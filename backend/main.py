from fastapi import FastAPI, UploadFile, File
from backend.csv_service import parse_csv, store_csv_in_sqlite
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
