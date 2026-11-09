from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import pandas as pd
import numpy as np
import matplotlib

matplotlib.use("Agg")

import matplotlib.pyplot as plt
import seaborn as sns
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        origin.strip()
        for origin in os.environ.get(
            "FRONTEND_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173",
        ).split(",")
        if origin.strip()
    ],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Root project directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, "dist")
FRONTEND_INDEX = os.path.join(FRONTEND_DIR, "index.html")

# Charts folder
CHART_DIR = os.path.join(BASE_DIR, "charts")

os.makedirs(CHART_DIR, exist_ok=True)
app.mount("/charts", StaticFiles(directory=CHART_DIR), name="charts")
if os.path.isdir(os.path.join(FRONTEND_DIR, "assets")):
    app.mount(
        "/assets",
        StaticFiles(directory=os.path.join(FRONTEND_DIR, "assets")),
        name="frontend-assets",
    )


@app.get("/")
async def read_root():
    if os.path.isfile(FRONTEND_INDEX):
        return FileResponse(FRONTEND_INDEX)
    return {
        "message": "AI Data Analyst API",
        "upload_endpoint": "/uploadfile/"
    }


@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return Response(status_code=204)


@app.post("/uploadfile/")
async def upload_file(file: UploadFile = File(...)):

    # Read CSV
    df = pd.read_csv(file.file)

    # Handle NaN and Infinity values
    df = df.replace([np.inf, -np.inf], np.nan)

    insights = []

    # Missing values
    if df.isnull().sum().sum() > 0:
        insights.append("Dataset contains missing values")

    # Duplicate rows
    if df.duplicated().sum() > 0:
        insights.append("Dataset contains duplicate rows")

    # Numeric Columns
    numeric_cols = df.select_dtypes(include="number").columns

    if len(numeric_cols) == 0:
        insights.append("No numeric columns found")

    chart_files = []

    # Histogram Charts
    for col in numeric_cols:
        try:

            plt.figure(figsize=(6, 4))

            plt.hist(
                df[col].dropna(),
                bins=10,
                color="skyblue",
                edgecolor="black"
            )

            plt.title(col)

            chart_path = os.path.join(
                CHART_DIR,
                f"{col}.png"
            )

            plt.savefig(
                chart_path,
                dpi=300,
                bbox_inches="tight"
            )

            plt.close()

            chart_files.append(
                {
                    "column": col,
                    "file": f"{col}.png",
                    "size": os.path.getsize(chart_path)
                }
            )

        except Exception as e:
            print(f"Chart Error: {e}")

    # Heatmap
    if len(numeric_cols) > 1:

        try:

            heatmap_path = os.path.join(
                CHART_DIR,
                "heatmap.png"
            )

            plt.figure(figsize=(8, 6))

            sns.heatmap(
                df[numeric_cols].corr(),
                annot=True,
                cmap="coolwarm"
            )

            plt.title("Correlation Heatmap")

            plt.savefig(
                heatmap_path,
                dpi=300,
                bbox_inches="tight"
            )

            plt.close()

            chart_files.append(
                {
                    "column": "correlation",
                    "file": "heatmap.png",
                    "size": os.path.getsize(heatmap_path)
                }
            )

        except Exception as e:
            print(f"Heatmap Error: {e}")

    # Correlation Matrix
    correlation = {}

    if len(numeric_cols) > 1:
        correlation = (
            df[numeric_cols]
            .corr()
            .round(2)
            .fillna(0)
            .to_dict()
        )

    # Detailed Column Insights
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

    # Recommendations
    recommendations = []

    if df.isnull().sum().sum() > 0:
        recommendations.append(
            "Handle missing values before modeling"
        )

    if df.duplicated().sum() > 0:
        recommendations.append(
            "Remove duplicate records"
        )

    if len(numeric_cols) > 1:
        recommendations.append(
            "Check highly correlated features"
        )

    # Business Insights
    business_insights = []

    if "Booking_Status" in df.columns:

        success_count = (
            df["Booking_Status"] == "Success"
        ).sum()

        success_rate = (
            success_count / len(df)
        ) * 100

        business_insights.append(
            f"{success_rate:.1f}% records are successful"
        )

    if "Vehicle_Type" in df.columns:

        top_vehicle = df["Vehicle_Type"].mode()[0]

        business_insights.append(
            f"{top_vehicle} is the most used vehicle type"
        )

    if "Pickup_Location" in df.columns:

        top_pickup = df["Pickup_Location"].mode()[0]

        business_insights.append(
            f"{top_pickup} is the busiest pickup location"
        )

    if "Drop_Location" in df.columns:

        top_drop = df["Drop_Location"].mode()[0]

        business_insights.append(
            f"{top_drop} is the busiest drop location"
        )

    if "Booking_Value" in df.columns:

        avg_booking = df["Booking_Value"].mean()

        business_insights.append(
            f"Average booking value is ₹{avg_booking:.0f}"
        )

    if "Payment_Method" in df.columns:

        payment_data = df["Payment_Method"].dropna()

        if len(payment_data) > 0:

            top_payment = payment_data.mode()[0]

            business_insights.append(
                f"{top_payment} is the most preferred payment method"
            )

    # Dataset Health Score
    health_score = 100

    health_score -= min(
        (
            df.isnull().sum().sum()
            /
            (df.shape[0] * df.shape[1])
        ) * 100,
        50
    )

    health_score -= min(
        (
            df.duplicated().sum()
            /
            len(df)
        ) * 100,
        20
    )

    health_score = float(
        round(
            max(0, health_score),
            2
        )
    )

    # Sample Data
    sample_data = (
        df.head(5)
        .fillna("")
        .astype(str)
        .to_dict(orient="records")
    )

    # Summary Data
    summary_data = (
        df.describe(include="all")
        .fillna("")
        .astype(str)
        .to_dict()
    )

    # EDA Report
    eda_report = {
        "shape": list(df.shape),
        "missing_values": df.isnull().sum().to_dict(),
        "correlation": correlation,
        "business_insights": business_insights,
        "health_score": health_score
    }

    return {
        "rows": int(df.shape[0]),
        "columns": int(df.shape[1]),
        "shape": list(df.shape),
        "column_names": list(df.columns),
        "data_types": df.dtypes.astype(str).to_dict(),
        "missing_values": df.isnull().sum().to_dict(),
        "duplicates": int(df.duplicated().sum()),
        "summary": summary_data,
        "insights": insights,
        "recommendations": recommendations,
        "business_insights": business_insights,
        "health_score": health_score,
        "sample_data": sample_data,
        "correlation": correlation,
        "charts": chart_files,
        "eda_report": eda_report
    }