export default function AdminInternshipsRedirect() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 p-8 text-center">
      <p className="text-slate-700 font-semibold text-lg">CRM portal is separate</p>
      <p className="text-slate-500 text-sm max-w-md">
        Staff tools live at <span className="font-semibold text-slate-800">portal.edlernity.com</span>
        . This learner site does not open the CRM.
      </p>
    </div>
  );
}
