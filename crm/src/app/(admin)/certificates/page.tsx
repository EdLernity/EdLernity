import AdminOnly from "@/components/crm/AdminOnly";
import CrmCertificatesPage from "@/components/crm/pages/CrmCertificatesPage";

export default function Page() {
  return (
    <AdminOnly>
      <CrmCertificatesPage />
    </AdminOnly>
  );
}
