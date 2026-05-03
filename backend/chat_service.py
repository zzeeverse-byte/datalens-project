import os
import pandas as pd
import google.generativeai as genai
import json
from dotenv import load_dotenv
from database import get_db_connection
from data_service import profile_dataframe

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

def _convert_to_native(obj):
    if pd.isna(obj):
        return None
    if hasattr(obj, 'item'):
        obj = obj.item()
    if isinstance(obj, (int, pd.core.dtypes.generic.ABCSeries, pd.core.dtypes.generic.ABCIndex)):
        # Just in case, to avoid checking Series/Index
        pass
    if isinstance(obj, int) and not isinstance(obj, bool):
        return int(obj)
    if isinstance(obj, float):
        return float(obj)
    if isinstance(obj, dict):
        return {str(k): _convert_to_native(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_convert_to_native(v) for v in obj]
    return obj

def query_data(query: str) -> list:
    """Runs a SQL SELECT query against the SQLite database and returns the results as a list of dictionaries."""
    conn = get_db_connection()
    try:
        # Basic safety check
        if not query.strip().upper().startswith("SELECT"):
            return [{"error": "Only SELECT queries are allowed."}]
        df = pd.read_sql(query, conn)
        conn.close()
        records = df.to_dict(orient="records")
        return _convert_to_native(records)
    except Exception as e:
        conn.close()
        return [{"error": str(e)}]

def get_statistics(column: str, table_name: str) -> dict:
    """Returns min, max, mean, median, and unique value counts for a specific column from the given table_name."""
    conn = get_db_connection()
    try:
        df = pd.read_sql(f"SELECT {column} FROM {table_name}", conn)
        conn.close()
        unique_counts = _convert_to_native(df[column].value_counts().to_dict())
        if pd.api.types.is_numeric_dtype(df[column]) and not pd.api.types.is_bool_dtype(df[column]):
            return {
                "min": float(df[column].min()) if not pd.isna(df[column].min()) else None,
                "max": float(df[column].max()) if not pd.isna(df[column].max()) else None,
                "mean": float(df[column].mean()) if not pd.isna(df[column].mean()) else None,
                "median": float(df[column].median()) if not pd.isna(df[column].median()) else None,
                "unique_counts": unique_counts
            }
        else:
            return {
                "unique_counts": unique_counts
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
        f"You are a helpful data assistant. You have access to a SQLite database containing the uploaded CSV data. "
        f"The current table we are analyzing is called '{table_name}'. "
        f"Always use the query_data tool to answer questions about the data. For example to find average grade by school run: SELECT school, AVG(G3) as avg_grade FROM student_mat GROUP BY school. "
        f"Never say you cannot retrieve data — always try using the query_data tool first."
    )
    
    model = genai.GenerativeModel(
        model_name='gemini-2.5-flash',
        tools=[query_data, get_statistics, get_column_values],
        system_instruction=system_instruction
    )
    
    chat = model.start_chat(enable_automatic_function_calling=True)
    try:
        response = chat.send_message(message)
        print("--- Chat History Debug ---")
        for idx, msg in enumerate(chat.history):
            print(f"Message {idx} ({msg.role}):")
            for part in msg.parts:
                if part.function_call:
                    print(f"  Tool Call: {part.function_call.name} with args: {part.function_call.args}")
                if part.function_response:
                    print(f"  Tool Response for {part.function_response.name}: {part.function_response.response}")
                if part.text:
                    print(f"  Text: {part.text}")
        print("--------------------------")
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


