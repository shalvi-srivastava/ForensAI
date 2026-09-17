import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

function PhotoUpload({ caseId }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setStatus("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleUpload = async () => {
    if (!file || !caseId) {
      setStatus("Missing file or case ID.");
      return;
    }

    setUploading(true);
    setStatus("");

    const formData = new FormData();
    formData.append("caseId", caseId);
    formData.append("type", "photo");
    formData.append("file", file);

    try {
      const response = await axiosInstance.post("/evidence", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus(`Uploaded successfully (Evidence ID: ${response.data.id})`);
    } catch (err) {
      if (err.response && err.response.data) {
        setStatus(`Upload failed: ${String(err.response.data)}`);
      } else {
        setStatus("Upload failed. Is the backend running?");
      }
    } finally {
      setUploading(false);
    }
  };

    return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById("photo-file-input").click()}
        className={`rounded-lg border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
          isDragging ? "border-slate-500 bg-slate-50" : "border-slate-300 hover:border-slate-400"
        }`}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="max-w-[200px] max-h-[200px] mx-auto rounded-md" />
        ) : (
          <p className="text-slate-500">Drag & drop a photo here, or click to select</p>
        )}
        <input
          id="photo-file-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files[0])}
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="mt-4 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-400 text-white font-medium rounded-md px-4 py-2 transition-colors"
      >
        {uploading ? "Uploading..." : "Upload Photo"}
      </button>

      {status && (
        <p className={`mt-3 text-sm ${status.startsWith("Upload failed") ? "text-red-600" : "text-green-700"}`}>
          {status}
        </p>
      )}
    </div>
  );
}

export default PhotoUpload;