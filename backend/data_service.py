import pandas as pd
import numpy as np

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
