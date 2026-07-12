import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BaseLayout from "../../Layout/BaseLayout";
import OfferLetterPanel from "./OfferLetterPanel";

function IssueOfferLetter() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("_userAuth");
    if (!token) {
      navigate("/auth/login", { replace: true });
    }
  }, [navigate]);

  return (
    <BaseLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <OfferLetterPanel />
      </div>
    </BaseLayout>
  );
}

export default IssueOfferLetter;
