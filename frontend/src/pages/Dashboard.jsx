import PhotoUpload from "../components/PhotoUpload";
import SketchConstructor from "../components/SketchConstructor";

function Dashboard() {
  return (
    <div>
      <h1>Dashboard (Protected Placeholder)</h1>
      <PhotoUpload caseId={1} />
      <SketchConstructor caseId={1} />
    </div>
  );
}

export default Dashboard;