import AdminOnly from "@/components/crm/AdminOnly";
import CrmUsersPage from "@/components/crm/pages/CrmUsersPage";

export default function Page() {
  return (
    <AdminOnly>
      <CrmUsersPage />
    </AdminOnly>
  );
}
