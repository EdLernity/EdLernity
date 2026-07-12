import { useEffect } from "react";

const CRM_URL = process.env.REACT_APP_CRM_URL || "http://localhost:3001";

export default function AdminInternshipsRedirect() {
  useEffect(() => {
    window.location.replace(CRM_URL);
  }, []);

  return (
    <div className="flex min-h-[50vh] items-center justify-center p-8 text-center">
      <p className="text-slate-600">Redirecting to EdLernity CRM...</p>
    </div>
  );
}
