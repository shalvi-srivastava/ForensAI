import PhotoUpload from "../components/PhotoUpload";
import SketchConstructor from "../components/SketchConstructor";

function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <h1 className="text-xl font-semibold text-slate-800">ForensAI Dashboard</h1>
        <p className="text-sm text-slate-500">Investigator workspace</p>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-medium text-slate-800 mb-4">Upload Photo Evidence</h2>
          <PhotoUpload caseId={1} />
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-medium text-slate-800 mb-4">Construct Sketch</h2>
          <SketchConstructor caseId={1} />
        </section>
      </main>
    </div>
  );
}

export default Dashboard;