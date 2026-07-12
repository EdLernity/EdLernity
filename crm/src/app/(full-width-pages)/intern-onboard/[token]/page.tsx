import InternOnboardPage from "@/components/crm/pages/InternOnboardPage";

type PageProps = {
  params: Promise<{ token: string }>;
};

export default async function InternOnboardRoute({ params }: PageProps) {
  const { token } = await params;
  return <InternOnboardPage token={token} />;
}
