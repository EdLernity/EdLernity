import AdminOnly from "@/components/crm/AdminOnly";
import CrmOverviewPage from "@/components/crm/pages/CrmOverviewPage";

export default function Page() {
  return (
    <AdminOnly>
      <CrmOverviewPage />
    </AdminOnly>
  );
}
