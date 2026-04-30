import os
import pandas as pd
import google.generativeai as genai
import json
from dotenv import load_dotenv
from backend.database import get_db_connection
from backend.data_service import profile_dataframe

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

def query_data(query: str) -> list:
    """Runs a SQL SELECT query against the SQLite database and returns the results as a list of dictionaries."""
    conn = get_db_connection()
    try:
        # Basic safety check
        if not query.strip().upper().startswith("SELECT"):
            return [{"error": "Only SELECT queries are allowed."}]
        df = pd.read_sql(query, conn)
        conn.close()
        return df.to_dict(orient="records")
    except Exception as e:
        conn.close()
        return [{"error": str(e)}]

def get_statistics(column: str, table_name: str) -> dict:
    """Returns min, max, mean, median, and unique value counts for a specific column from the given table_name."""
    conn = get_db_connection()
    try:
        df = pd.read_sql(f"SELECT {column} FROM {table_name}", conn)
        conn.close()
        if pd.api.types.is_numeric_dtype(df[column]) and not pd.api.types.is_bool_dtype(df[column]):
            return {
                "min": float(df[column].min()) if not pd.isna(df[column].min()) else None,
                "max": float(df[column].max()) if not pd.isna(df[column].max()) else None,
                "mean": float(df[column].mean()) if not pd.isna(df[column].mean()) else None,
                "median": float(df[column].median()) if not pd.isna(df[column].median()) else None,
                "unique_counts": df[column].value_counts().to_dict()
            }
        else:
            return {
                "unique_counts": df[column].value_counts().to_dict()
            }
    except Exception as e:
        conn.close()
        return {"error": str(e)}

def get_column_values(column: str, table_name: str) -> list:
    """Returns all unique values in a specific column from the given table_name."""
    conn = get_db_connection()
    try:
        df = pd.read_sql(f"SELECT DISTINCT {column} FROM {table_name}", conn)
        conn.close()
        return df[column].astype(str).tolist()
    except Exception as e:
        conn.close()
        return [{"error": str(e)}]

def chat_with_data(message: str, table_name: str) -> str:
    system_instruction = (
        f"You are a helpful data assistant. You have access to a SQLite database. "
        f"The current table we are analyzing is called '{table_name}'. "
        f"Use the provided tools to answer the user's questions about this dataset."
    )
    
    model = genai.GenerativeModel(
        model_name='gemini-2.5-flash',
        tools=[query_data, get_statistics, get_column_values],
        system_instruction=system_instruction
    )
    
    chat = model.start_chat(enable_automatic_function_calling=True)
    try:
        response = chat.send_message(message)
        return response.text
    except Exception as e:
        return f"Error communicating with Gemini: {str(e)}"

def generate_executive_summary(table_name: str) -> str:
    conn = get_db_connection()
    try:
        df = pd.read_sql(f"SELECT * FROM {table_name}", conn)
        conn.close()
        
        profile = profile_dataframe(df)
        profile_json = json.dumps(profile, indent=2, default=str)
        
        prompt = (
            f"You are a professional data analyst. I am providing you with the statistical profile "
            f"of a dataset called '{table_name}'. The profile includes column names, data types, "
            f"and actual statistics such as min, max, mean, median, and unique value counts.\n\n"
            f"Please write a comprehensive and professional executive summary of this dataset based on the following profile. "
            f"You MUST reference the actual numbers, statistics, and column names provided in the profile. "
            f"Avoid generic text; focus on the concrete data insights.\n\n"
            f"Profile:\n{profile_json}"
        )
        
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error generating summary: {str(e)}"


