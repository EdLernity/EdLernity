import React, { useEffect } from "react";

const CRM_URL = (process.env.REACT_APP_CRM_URL || "http://localhost:3001").replace(/\/$/, "");

/** Trainers manage programs in CRM only. */
function TrainerInternshipDashboard() {
  useEffect(() => {
    window.location.replace(`${CRM_URL}/trainer`);
  }, []);

  return (
    <div className="min-h-[50vh] flex items-center justify-center text-slate-500 font-semibold">
      Redirecting to trainer portal...
    </div>
  );
}

export default TrainerInternshipDashboard;
