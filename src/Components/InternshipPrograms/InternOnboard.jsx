import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import BaseLayout from "../../Layout/BaseLayout";

const CRM_URL = (process.env.REACT_APP_CRM_URL || "http://localhost:3001").replace(/\/$/, "");

function InternOnboard() {
  const { token } = useParams();

  useEffect(() => {
    if (token) {
      window.location.replace(`${CRM_URL}/intern-onboard/${token}`);
    }
  }, [token]);

  return (
    <BaseLayout>
      <div className="max-w-lg mx-auto py-20 px-6 text-center text-slate-600">
        Redirecting to onboarding...
      </div>
    </BaseLayout>
  );
}

export default InternOnboard;
