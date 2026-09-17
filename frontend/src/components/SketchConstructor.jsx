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
      <h3>Sketch Constructor</h3>
      <canvas ref={canvasElRef} style={{ border: "1px solid black" }} />
      <div>
        <button onClick={handleClear}>Clear</button>
        <button onClick={handleSubmit} disabled={uploading}>
          {uploading ? "Uploading..." : "Submit Sketch"}
        </button>
      </div>
      {status && <p>{status}</p>}
    </div>
  );
}

export default SketchConstructor;