import pandas as pd
import numpy as np
from database import get_db_connection

def profile_dataframe(df: pd.DataFrame) -> dict:
    profile = {}
    
    for col in df.columns:
        # Convert yes/no columns to boolean
        if pd.api.types.is_object_dtype(df[col]) or pd.api.types.is_string_dtype(df[col]):
            # dropna is needed to ignore NaNs when checking unique values
            valid_vals = df[col].dropna()
            if not valid_vals.empty:
                unique_vals = set(valid_vals.astype(str).str.lower().str.strip().unique())
                if unique_vals.issubset({'yes', 'no'}):
                    df[col] = df[col].astype(str).str.lower().str.strip().map({'yes': True, 'no': False})
                    # Use pandas boolean type with NA support if needed, but for simplicity:
                    df[col] = df[col].astype('bool')

    for col in df.columns:
        col_type = str(df[col].dtype)
        col_info = {"name": col}
        
        if pd.api.types.is_bool_dtype(df[col]) or col_type == 'bool':
            col_info["type"] = "boolean"
            counts = df[col].value_counts(dropna=False).to_dict()
            col_info["counts"] = {str(k): int(v) for k, v in counts.items()}
        elif pd.api.types.is_numeric_dtype(df[col]):
            col_info["type"] = "numeric"
            col_info["min"] = float(df[col].min()) if not pd.isna(df[col].min()) else None
            col_info["max"] = float(df[col].max()) if not pd.isna(df[col].max()) else None
            col_info["mean"] = float(df[col].mean()) if not pd.isna(df[col].mean()) else None
            col_info["median"] = float(df[col].median()) if not pd.isna(df[col].median()) else None
        else:
            col_info["type"] = "categorical"
            counts = df[col].value_counts(dropna=False).to_dict()
            col_info["counts"] = {str(k): int(v) for k, v in counts.items()}
            
        profile[col] = col_info
        
    return profile

def build_where_clause(filters: dict):
    if not filters:
        return "", []
    
    clauses = []
    params = []
    for k, v in filters.items():
        if v is not None:
            clauses.append(f"{k} = ?")
            params.append(v)
            
    if not clauses:
        return "", []
        
    return " WHERE " + " AND ".join(clauses), params

def get_avg_grade_by_school(table_name: str, filters: dict = None):
    conn = get_db_connection()
    where_clause, params = build_where_clause(filters)
    df = pd.read_sql(f"SELECT school, AVG(G3) as avg_G3 FROM {table_name}{where_clause} GROUP BY school", conn, params=params)
    conn.close()
    return df.to_dict(orient="records")

def get_studytime_vs_grade(table_name: str, filters: dict = None):
    conn = get_db_connection()
    where_clause, params = build_where_clause(filters)
    df = pd.read_sql(f"SELECT studytime, AVG(G3) as avg_G3 FROM {table_name}{where_clause} GROUP BY studytime ORDER BY studytime", conn, params=params)
    conn.close()
    return df.to_dict(orient="records")

def get_internet_vs_grade(table_name: str, filters: dict = None):
    conn = get_db_connection()
    where_clause, params = build_where_clause(filters)
    df = pd.read_sql(f"SELECT internet, AVG(G3) as avg_G3 FROM {table_name}{where_clause} GROUP BY internet", conn, params=params)
    conn.close()
    return df.to_dict(orient="records")

def get_absences_vs_grade(table_name: str, filters: dict = None):
    conn = get_db_connection()
    where_clause, params = build_where_clause(filters)
    df = pd.read_sql(f"SELECT absences, G3 FROM {table_name}{where_clause}", conn, params=params)
    conn.close()
    return df.to_dict(orient="records")

def get_parent_education_vs_grade(table_name: str, filters: dict = None):
    conn = get_db_connection()
    where_clause, params = build_where_clause(filters)
    df = pd.read_sql(f"SELECT Medu, AVG(G3) as avg_G3 FROM {table_name}{where_clause} GROUP BY Medu ORDER BY Medu", conn, params=params)
    conn.close()
    return df.to_dict(orient="records")

def get_generic_charts(table_name: str):
    conn = get_db_connection()
    try:
        df = pd.read_sql(f"SELECT * FROM {table_name}", conn)
    finally:
        conn.close()
        
    charts = []
    
    for col in df.columns[:4]:
        if pd.api.types.is_numeric_dtype(df[col]):
            valid_data = df[col].dropna()
            if len(valid_data) == 0:
                continue
            counts, bins = np.histogram(valid_data, bins=min(10, len(valid_data.unique())))
            data = [{"bin": f"{bins[i]:.1f}-{bins[i+1]:.1f}", "count": int(c)} for i, c in enumerate(counts)]
            charts.append({
                "title": f"Distribution of {col}",
                "type": "numeric",
                "dataKeyX": "bin",
                "dataKeyY": "count",
                "data": data
            })
        else:
            counts = df[col].value_counts(dropna=False).head(10).to_dict()
            data = [{"name": str(k), "value": int(v)} for k, v in counts.items()]
            charts.append({
                "title": f"Count of {col}",
                "type": "categorical",
                "dataKeyX": "name",
                "dataKeyY": "value",
                "data": data
            })
            
    return charts

def get_dynamic_filters(table_name: str):
    conn = get_db_connection()
    try:
        df = pd.read_sql(f"SELECT * FROM {table_name}", conn)
    finally:
        conn.close()
        
    filters_options = []
    
    for col in df.columns:
        # We also want to include integer columns if they act as categories (e.g., Medu, Fedu)
        # So we just check if unique values < 10
        unique_vals = df[col].dropna().unique()
        if len(unique_vals) < 10:
            filters_options.append({
                "column": col,
                "options": sorted([str(x) for x in unique_vals])
            })
                
    return filters_options
