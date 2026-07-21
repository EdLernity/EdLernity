import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import BaseLayout from "../../Layout/BaseLayout";
import { CRM_URL } from "../../URL_Config";

function InternOnboard() {
  const { token } = useParams();

  useEffect(() => {
    if (token) {
      window.location.replace(`${CRM_URL}/intern-onboard/${token}`);
    }
  }, [token]);

  return (
    <BaseLayout>
      <div className="min-h-[50vh] flex items-center justify-center text-slate-500 font-semibold">
        Redirecting to onboarding…
      </div>
    </BaseLayout>
  );
}

export default InternOnboard;
