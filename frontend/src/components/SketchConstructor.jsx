import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import axiosInstance from "../api/axiosInstance";

function SketchConstructor({ caseId }) {
  const canvasElRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasElRef.current, {
      width: 400,
      height: 400,
      backgroundColor: "#ffffff",
    });

    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.width = 3;
    canvas.freeDrawingBrush.color = "#000000";
    canvas.isDrawingMode = true;

    const faceGuide = new fabric.Ellipse({
      left: 200,
      top: 200,
      originX: "center",
      originY: "center",
      rx: 90,
      ry: 120,
      fill: "transparent",
      stroke: "#cccccc",
      strokeWidth: 1,
      selectable: false,
      evented: false,
    });

    canvas.add(faceGuide);
    canvas.sendObjectToBack(faceGuide);

    fabricCanvasRef.current = canvas;

    return () => {
      canvas.dispose();
    };
  }, []);

  const handleClear = () => {
    const canvas = fabricCanvasRef.current;
    // Remove everything except the face guide (first object added)
    const objects = canvas.getObjects();
    objects.slice(1).forEach((obj) => canvas.remove(obj));
    canvas.renderAll();
    setStatus("");
  };

  const handleSubmit = async () => {
    if (!caseId) {
      setStatus("Missing case ID.");
      return;
    }

    setUploading(true);
    setStatus("");

    try {
      const canvas = fabricCanvasRef.current;

      // Export the canvas (including the face guide) as a PNG data URL
      const dataUrl = canvas.toDataURL({ format: "png" });

      // Convert the data URL into an actual Blob/File for upload
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "sketch.png", { type: "image/png" });

      const formData = new FormData();
      formData.append("caseId", caseId);
      formData.append("type", "sketch");
      formData.append("file", file);

      const response = await axiosInstance.post("/evidence", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setStatus(`Sketch uploaded successfully (Evidence ID: ${response.data.id})`);
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
      <canvas ref={canvasElRef} className="border border-slate-300 rounded-md" />
      <div className="mt-4 flex gap-3">
        <button
          onClick={handleClear}
          className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium rounded-md px-4 py-2 transition-colors"
        >
          Clear
        </button>
        <button
          onClick={handleSubmit}
          disabled={uploading}
          className="bg-slate-800 hover:bg-slate-900 disabled:bg-slate-400 text-white font-medium rounded-md px-4 py-2 transition-colors"
        >
          {uploading ? "Uploading..." : "Submit Sketch"}
        </button>
      </div>
      {status && (
        <p className={`mt-3 text-sm ${status.startsWith("Upload failed") ? "text-red-600" : "text-green-700"}`}>
          {status}
        </p>
      )}
    </div>
  );
}

export default SketchConstructor;