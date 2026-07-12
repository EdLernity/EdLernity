import { Suspense } from "react";
import AdminOnly from "@/components/crm/AdminOnly";
import CrmOfferLettersPage from "@/components/crm/pages/CrmOfferLettersPage";

export default function Page() {
  return (
    <AdminOnly>
      <Suspense fallback={<div className="p-4 text-gray-500">Loading...</div>}>
        <CrmOfferLettersPage />
      </Suspense>
    </AdminOnly>
  );
}
