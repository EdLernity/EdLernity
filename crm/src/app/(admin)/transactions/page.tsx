import AdminOnly from "@/components/crm/AdminOnly";
import CrmTransactionsPage from "@/components/crm/pages/CrmTransactionsPage";

export default function Page() {
  return (
    <AdminOnly>
      <CrmTransactionsPage />
    </AdminOnly>
  );
}
