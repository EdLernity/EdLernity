"use client";

import AdminOnly from "@/components/crm/AdminOnly";
import CrmOverviewPage from "@/components/crm/pages/CrmOverviewPage";
import CrmManagerDashboardPage from "@/components/crm/pages/CrmManagerDashboardPage";
import { useAuth } from "@/context/AuthContext";

export default function Page() {
  const { isAdmin, isManager, loading } = useAuth();

  if (loading) {
    return <p className="text-gray-500">Loading...</p>;
  }

  if (isAdmin) {
    return (
      <AdminOnly>
        <CrmOverviewPage />
      </AdminOnly>
    );
  }

  if (isManager) {
    return <CrmManagerDashboardPage />;
  }

  return null;
}
