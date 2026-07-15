import AdminOnly from "@/components/crm/AdminOnly";
import CrmTrainerAssignmentsPage from "@/components/crm/pages/CrmTrainerAssignmentsPage";

export default function Page() {
  return (
    <AdminOnly>
      <CrmTrainerAssignmentsPage />
    </AdminOnly>
  );
}
