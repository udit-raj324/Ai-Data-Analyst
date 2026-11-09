from fastapi import FastAPI, UploadFile, File
from fastapi.responses import Response
import pandas as pd

app = FastAPI()


@app.get("/")
async def read_root():
    return {
        "message": "CSV Upload API",
        "upload_endpoint": "/uploadfile/"
    }


@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return Response(status_code=204)


@app.post("/uploadfile/")
async def upload_file(file: UploadFile = File(...)):

    # Read CSV
    df = pd.read_csv(file.file)

    # Debug
    print(df.head())
    print(df.dtypes)

    # Insights list
    insights = []

    # Missing values
    if df.isnull().sum().sum() > 0:
        insights.append("Dataset contains missing values")

    # Duplicate rows
    if df.duplicated().sum() > 0:
        insights.append("Dataset contains duplicate rows")

    # Numeric columns
    numeric_cols = df.select_dtypes(include="number").columns

    if len(numeric_cols) == 0:
        insights.append("No numeric columns found")

    # Correlation Analysis
    correlation = {}

    if len(numeric_cols) > 1:
        correlation = (
            df[numeric_cols]
            .corr()
            .round(2)
            .to_dict()
        )

    # Column-wise insights
    for col in df.columns:

        missing = df[col].isnull().sum()

        if missing > 0:
            insights.append(
                f"{col} has {missing} missing values"
            )

        if df[col].nunique() == 1:
            insights.append(
                f"{col} contains only one unique value"
            )

    # Response
    return {
        "rows": int(df.shape[0]),
        "columns": int(df.shape[1]),
        "column_names": list(df.columns),
        "data_types": df.dtypes.astype(str).to_dict(),
        "missing_values": df.isnull().sum().to_dict(),
        "duplicates": int(df.duplicated().sum()),
        "summary": df.describe(include="all").fillna("").to_dict(),
        "insights": insights,
        "correlation": correlation
    }