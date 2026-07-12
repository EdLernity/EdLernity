import AdminOnly from "@/components/crm/AdminOnly";
import CrmCareersProgramsPage from "@/components/crm/pages/CrmCareersProgramsPage";

export default function Page() {
  return (
    <AdminOnly>
      <CrmCareersProgramsPage />
    </AdminOnly>
  );
}
