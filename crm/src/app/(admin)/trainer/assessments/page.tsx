import { Suspense } from "react";
import CrmTrainerAssessmentsPage from "@/components/crm/pages/CrmTrainerAssessmentsPage";

export default function Page() {
  return (
    <Suspense fallback={<p className="text-sm text-gray-500">Loading assessments…</p>}>
      <CrmTrainerAssessmentsPage />
    </Suspense>
  );
}
