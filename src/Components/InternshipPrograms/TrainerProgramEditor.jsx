import React, { useEffect } from "react";

const CRM_URL = (process.env.REACT_APP_CRM_URL || "http://localhost:3001").replace(/\/$/, "");

/** Trainers edit programs in CRM only. */
function TrainerProgramEditor() {
  useEffect(() => {
    const slug = window.location.pathname.split("/").filter(Boolean).pop();
    window.location.replace(slug && slug !== "internships" ? `${CRM_URL}/trainer/${slug}` : `${CRM_URL}/trainer`);
  }, []);

  return (
    <div className="min-h-[50vh] flex items-center justify-center text-slate-500 font-semibold">
      Redirecting to trainer portal...
    </div>
  );
}

export default TrainerProgramEditor;
