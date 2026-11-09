import { useRef, useState } from "react";
import { AlertCircle, Check, FileSpreadsheet, LoaderCircle, Sparkles, Upload, X } from "lucide-react";
import { uploadDataset } from "../services/api.js";

export default function UploadSection({ onUploadComplete, hasData }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function handleFile(selectedFile) {
    if (!selectedFile) return;
    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      setError("Please choose a CSV file to continue.");
      setStatus("error");
      return;
    }

    setFile(selectedFile);
    setError("");
    setProgress(0);
    setStatus("uploading");
    try {
      const result = await uploadDataset(selectedFile, (event) => {
        if (event.total) setProgress(Math.round((event.loaded * 100) / event.total));
      });
      setProgress(100);
      setStatus("success");
      onUploadComplete(result, selectedFile);
    } catch (uploadError) {
      const message = uploadError.response?.data?.detail || uploadError.message || "The upload could not be completed.";
      setError(message);
      setStatus("error");
    }
  }

  function onDrop(event) {
    event.preventDefault();
    setDragging(false);
    handleFile(event.dataTransfer.files?.[0]);
  }

  function reset() {
    setFile(null);
    setProgress(0);
    setStatus("idle");
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <section className={`upload-card ${dragging ? "upload-card-dragging" : ""}`} id="upload">
      <div className="upload-copy">
        <div className="eyebrow"><Sparkles size={13} /> YOUR DATA, DECODED</div>
        <h2>Make your data<br /><span>make sense.</span></h2>
        <p>Upload a CSV and get a clear picture of what’s happening — in seconds.</p>
        <div className="upload-perks">
          <span><Check size={14} /> Automated EDA</span>
          <span><Check size={14} /> Business insights</span>
          <span><Check size={14} /> Visual reports</span>
        </div>
      </div>

      <div
        className="dropzone"
        onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => status !== "uploading" && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") inputRef.current?.click(); }}
        aria-label="Choose or drop a CSV file to upload"
      >
        <input ref={inputRef} type="file" accept=".csv,text/csv" className="hidden-input" onChange={(event) => handleFile(event.target.files?.[0])} />
        {status === "uploading" ? (
          <>
            <div className="drop-icon is-loading"><LoaderCircle size={23} className="spin" /></div>
            <strong>Analyzing your dataset</strong>
            <span className="drop-hint">Uploading {file?.name}</span>
            <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
            <span className="progress-label">{progress}% uploaded · analysis may take a moment</span>
          </>
        ) : status === "success" ? (
          <>
            <div className="drop-icon is-success"><Check size={24} /></div>
            <strong>Analysis complete</strong>
            <span className="drop-hint">{file?.name} is ready to explore</span>
            <button type="button" className="text-button" onClick={(event) => { event.stopPropagation(); reset(); }}>Upload another file</button>
          </>
        ) : status === "error" ? (
          <>
            <div className="drop-icon is-error"><AlertCircle size={23} /></div>
            <strong>Something went wrong</strong>
            <span className="drop-hint">{error}</span>
            <button type="button" className="text-button" onClick={(event) => { event.stopPropagation(); reset(); }}>Try another file</button>
          </>
        ) : (
          <>
            <div className="drop-icon"><Upload size={23} /></div>
            <strong>Drop your CSV here</strong>
            <span className="drop-hint">or <span className="browse-link">browse files</span> from your computer</span>
            <span className="file-format"><FileSpreadsheet size={13} /> CSV files only <span>·</span> Max file size depends on your server</span>
          </>
        )}
      </div>
      {hasData && status === "idle" && <button className="clear-data" onClick={reset}><X size={13} /> Ready for a new analysis</button>}
    </section>
  );
}
