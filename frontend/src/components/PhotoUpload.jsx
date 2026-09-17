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
        style={{
          border: isDragging ? "2px solid blue" : "2px dashed gray",
          padding: "20px",
          textAlign: "center",
          cursor: "pointer",
        }}
        onClick={() => document.getElementById("photo-file-input").click()}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" style={{ maxWidth: "200px", maxHeight: "200px" }} />
        ) : (
          <p>Drag & drop a photo here, or click to select</p>
        )}
        <input
          id="photo-file-input"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => handleFileSelect(e.target.files[0])}
        />
      </div>

      <button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? "Uploading..." : "Upload Photo"}
      </button>

      {status && <p>{status}</p>}
    </div>
  );
}

export default PhotoUpload;