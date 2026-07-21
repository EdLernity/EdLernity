import React from "react";

/** Trainers manage programs in the separate CRM portal. */
function TrainerInternshipDashboard() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 text-center px-6">
      <p className="text-slate-700 font-semibold text-lg">Trainer portal is separate</p>
      <p className="text-slate-500 text-sm max-w-md">
        Sign in at <span className="font-semibold text-slate-800">portal.edlernity.com</span> to
        manage trainer programs.
      </p>
    </div>
  );
}

export default TrainerInternshipDashboard;
