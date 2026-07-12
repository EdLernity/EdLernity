import AdminOnly from "@/components/crm/AdminOnly";
import CrmOperationsPage from "@/components/crm/pages/CrmOperationsPage";

export default function Page() {
  return (
    <AdminOnly>
      <CrmOperationsPage />
    </AdminOnly>
  );
}
