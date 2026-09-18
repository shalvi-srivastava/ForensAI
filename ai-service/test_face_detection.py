import cv2
import insightface
from insightface.app import FaceAnalysis

# Load the pretrained face analysis pipeline (detection + recognition).
# 'buffalo_l' is InsightFace's standard bundled model pack — includes
# SCRFD for detection and ArcFace for recognition/embeddings, matching
# exactly what your synopsis and roadmap specify.
app = FaceAnalysis(name='buffalo_l', providers=['CPUExecutionProvider'])
app.prepare(ctx_id=0, det_size=(640, 640))

# Load the test image with OpenCV
img_path = "test_images/test_img.jpeg"
img = cv2.imread(img_path)

if img is None:
    raise FileNotFoundError(f"Could not read image at {img_path} — check the path/filename.")

print(f"Image loaded successfully. Shape: {img.shape}")

# Run detection + embedding extraction
faces = app.get(img)

print(f"\nNumber of faces detected: {len(faces)}")

for i, face in enumerate(faces):
    print(f"\n--- Face {i+1} ---")
    print(f"Bounding box: {face.bbox}")
    print(f"Detection confidence: {face.det_score:.4f}")
    print(f"Embedding shape: {face.embedding.shape}")
    print(f"Embedding (first 5 values): {face.embedding[:5]}")