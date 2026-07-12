import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  Download,
  FileBadge,
  GraduationCap,
  Search,
  Shield,
  UserPlus,
  Users,
} from "lucide-react";
import OfferLetterPanel from "../OfferLetter/OfferLetterPanel";
import BaseLayout from "../../Layout/BaseLayout";
import SeoHead from "../SEO/SeoHead";
import { showSnackbar } from "../Utils/enQueSnackBar";
import { isUserLoggedIn } from "./internshipCartUtils";
import { exportInternshipEnrollmentsToXlsx } from "./adminInternshipExport";
import { downloadInternshipCertificatePdf } from "./internshipCertificatePdf";
import {
  assignStudentToInternship,
  assignTrainerToProgram,
  fetchAdminEnrollments,
  fetchAdminPrograms,
  fetchAdminTrainers,
  issueInternshipCertificate,
  setUserRole,
} from "./internshipApi";

const TABS = [
  { id: "enrollments", label: "Enrollments & Certificates" },
  { id: "offer-letters", label: "Offer Letters" },
  { id: "operations", label: "Assignments & Roles" },
];

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function studentName(student) {
  if (!student) return "—";
  return `${student.firstName || ""} ${student.lastName || ""}`.trim() || "—";
}

function StatCard({ label, value, icon: Icon, accent }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm p-5 text-white">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-100">{label}</p>
          <p className="text-3xl font-extrabold mt-2">{value}</p>
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${accent}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

function AdminInternshipDashboard() {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("enrollments");
  const [search, setSearch] = useState("");
  const [programFilter, setProgramFilter] = useState("all");
  const [certificateFilter, setCertificateFilter] = useState("all");
  const [issuingId, setIssuingId] = useState(null);
  const [certificateModal, setCertificateModal] = useState(null);
  const [studentForm, setStudentForm] = useState({
    studentEmail: "",
    internshipSlug: "",
    trainerEmail: "",
  });
  const [trainerForm, setTrainerForm] = useState({
    trainerEmail: "",
    internshipSlug: "",
  });
  const [roleForm, setRoleForm] = useState({ email: "", role: "trainer" });
  const [offerLetterPrefill, setOfferLetterPrefill] = useState({ email: "", name: "" });

  const loadData = async () => {
    try {
      const [p, t, e] = await Promise.all([
        fetchAdminPrograms(),
        fetchAdminTrainers(),
        fetchAdminEnrollments(),
      ]);
      setPrograms(p);
      setTrainers(t);
      setEnrollments(e);
    } catch {
      showSnackbar("Admin access required or session expired.", "error", "top");
      navigate("/mycourses", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isUserLoggedIn()) {
      navigate("/auth/login", { replace: true, state: { redirectUrl: "/admin/internships" } });
      return;
    }
    loadData();
  }, [navigate]);

  const stats = useMemo(() => {
    const issued = enrollments.filter((row) => row.certificate?.issued).length;
    return {
      students: enrollments.length,
      trainers: trainers.length,
      programs: programs.length,
      certificates: issued,
    };
  }, [enrollments, trainers, programs]);

  const filteredEnrollments = useMemo(() => {
    const query = search.trim().toLowerCase();
    return enrollments.filter((row) => {
      const matchesProgram = programFilter === "all" || row.internshipSlug === programFilter;
      const matchesCertificate =
        certificateFilter === "all" ||
        (certificateFilter === "issued" && row.certificate?.issued) ||
        (certificateFilter === "pending" && !row.certificate?.issued);
      const matchesSearch =
        !query ||
        studentName(row.student).toLowerCase().includes(query) ||
        (row.student?.email || "").toLowerCase().includes(query) ||
        (row.programTitle || "").toLowerCase().includes(query) ||
        (row.trainer?.email || "").toLowerCase().includes(query);
      return matchesProgram && matchesCertificate && matchesSearch;
    });
  }, [enrollments, search, programFilter, certificateFilter]);

  const handleAssignStudent = async (e) => {
    e.preventDefault();
    try {
      await assignStudentToInternship(studentForm);
      showSnackbar("Student assigned successfully", "success", "top");
      setStudentForm({ studentEmail: "", internshipSlug: "", trainerEmail: "" });
      loadData();
    } catch {
      showSnackbar("Failed to assign student", "error", "top");
    }
  };

  const handleAssignTrainer = async (e) => {
    e.preventDefault();
    try {
      await assignTrainerToProgram(trainerForm);
      showSnackbar("Trainer assigned to program", "success", "top");
      setTrainerForm({ trainerEmail: "", internshipSlug: "" });
      loadData();
    } catch {
      showSnackbar("Failed to assign trainer", "error", "top");
    }
  };

  const handleSetRole = async (e) => {
    e.preventDefault();
    try {
      await setUserRole(roleForm);
      showSnackbar(`Role updated to ${roleForm.role}`, "success", "top");
      loadData();
    } catch {
      showSnackbar("Failed to update role", "error", "top");
    }
  };

  const openCertificateModal = (row) => {
    setCertificateModal({
      enrollmentId: row.id,
      studentEmail: row.student?.email,
      internshipSlug: row.internshipSlug,
      programTitle: row.programTitle,
      defaultName: studentName(row.student),
      studentName: studentName(row.student),
      alreadyIssued: row.certificate?.issued,
      uuid: row.certificate?.uuid,
    });
  };

  const handleIssueCertificate = async () => {
    if (!certificateModal?.studentName?.trim()) {
      showSnackbar("Enter the student name for the certificate", "error", "top");
      return;
    }

    setIssuingId(certificateModal.enrollmentId);
    try {
      const result = await issueInternshipCertificate({
        studentEmail: certificateModal.studentEmail,
        internshipSlug: certificateModal.internshipSlug,
        studentName: certificateModal.studentName.trim(),
      });

      await downloadInternshipCertificatePdf({
        studentName: result.certificate.studentName,
        programTitle: result.certificate.programTitle || certificateModal.programTitle,
        uuid: result.certificate.uuid,
      });

      showSnackbar(result.message, "success", "top");
      setCertificateModal(null);
      loadData();
    } catch {
      showSnackbar("Failed to issue certificate", "error", "top");
    } finally {
      setIssuingId(null);
    }
  };

  const handleDownloadExistingCertificate = async (row) => {
    if (!row.certificate?.issued) return;
    try {
      await downloadInternshipCertificatePdf({
        studentName: row.certificate.studentName,
        programTitle: row.programTitle,
        uuid: row.certificate.uuid,
      });
    } catch {
      showSnackbar("Could not generate certificate PDF", "error", "top");
    }
  };

  const handleExport = () => {
    const stamp = new Date().toISOString().slice(0, 10);
    exportInternshipEnrollmentsToXlsx(
      filteredEnrollments,
      `edlernity-internship-users-${stamp}.xlsx`
    );
    showSnackbar("Excel file downloaded", "success", "top");
  };

  const openOfferLetter = (row) => {
    setOfferLetterPrefill({
      email: row.student?.email || "",
      name: studentName(row.student),
    });
    setActiveTab("offer-letters");
  };

  if (loading) {
    return (
      <BaseLayout>
        <div className="min-h-[50vh] flex items-center justify-center text-slate-500 font-semibold">
          Loading command center...
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <SeoHead title="Admin Command Center" path="/admin/internships" />
      <div className="bg-slate-50 min-h-screen font-sans">
        <div className="bg-gradient-to-br from-[#181FC5] via-[#2D35D6] to-[#4F46E5] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link
              to="/mycourses"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-100 hover:text-white mb-6"
            >
              <ArrowLeft className="w-4 h-4" /> Back to My Learning
            </Link>

            <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center">
                  <Shield className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-100">EdLernity Admin</p>
                  <h1 className="text-3xl sm:text-4xl font-extrabold mt-1">Command Center</h1>
                  <p className="text-blue-100 mt-2 max-w-2xl text-sm sm:text-base">
                    Central hub for enrollments, offer letters, trainer assignments, certificate issuance, and learner exports across EdLernity.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Enrolled Students" value={stats.students} icon={Users} accent="bg-white/15" />
              <StatCard label="Active Trainers" value={stats.trainers} icon={GraduationCap} accent="bg-white/15" />
              <StatCard label="Programs" value={stats.programs} icon={FileBadge} accent="bg-white/15" />
              <StatCard label="Certificates Issued" value={stats.certificates} icon={Award} accent="bg-emerald-400/20" />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition ${
                  activeTab === tab.id
                    ? "bg-[#181FC5] text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-[#181FC5]/30"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "enrollments" && (
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-100 bg-white p-5 sm:p-6 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:justify-between">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 flex-1">
                    <div className="relative sm:col-span-2 lg:col-span-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search name, email, program..."
                        className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm"
                      />
                    </div>
                    <select
                      value={programFilter}
                      onChange={(e) => setProgramFilter(e.target.value)}
                      className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
                    >
                      <option value="all">All programs</option>
                      {programs.map((p) => (
                        <option key={p.slug} value={p.slug}>{p.title}</option>
                      ))}
                    </select>
                    <select
                      value={certificateFilter}
                      onChange={(e) => setCertificateFilter(e.target.value)}
                      className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
                    >
                      <option value="all">All certificate status</option>
                      <option value="issued">Issued only</option>
                      <option value="pending">Pending only</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={handleExport}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800"
                  >
                    <Download className="w-4 h-4" />
                    Export XLSX
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900">Learner Registry</h2>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {filteredEnrollments.length} record{filteredEnrollments.length === 1 ? "" : "s"} shown
                    </p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr className="text-left">
                        <th className="px-6 py-3 font-bold">Student</th>
                        <th className="px-6 py-3 font-bold">Program</th>
                        <th className="px-6 py-3 font-bold">Trainer</th>
                        <th className="px-6 py-3 font-bold">Enrolled</th>
                        <th className="px-6 py-3 font-bold">Certificate</th>
                        <th className="px-6 py-3 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEnrollments.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                            No enrollments match your filters.
                          </td>
                        </tr>
                      ) : (
                        filteredEnrollments.map((row) => (
                          <tr key={row.id} className="border-t border-slate-100 hover:bg-slate-50/70">
                            <td className="px-6 py-4">
                              <p className="font-bold text-slate-900">{studentName(row.student)}</p>
                              <p className="text-slate-500 text-xs mt-0.5">{row.student?.email}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-semibold text-slate-800">{row.programTitle}</p>
                              <p className="text-xs text-slate-400 mt-0.5">{row.internshipSlug}</p>
                            </td>
                            <td className="px-6 py-4 text-slate-600">{row.trainer?.email || "Unassigned"}</td>
                            <td className="px-6 py-4 text-slate-600">{formatDate(row.enrolledAt)}</td>
                            <td className="px-6 py-4">
                              {row.certificate?.issued ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                                  <Award className="w-3.5 h-3.5" /> Issued
                                </span>
                              ) : (
                                <span className="inline-flex px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold">
                                  Pending
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => openOfferLetter(row)}
                                  className="px-3 py-2 rounded-lg border border-[#181FC5]/20 text-[#181FC5] text-xs font-bold hover:bg-[#181FC5]/5"
                                >
                                  Offer Letter
                                </button>
                                {row.certificate?.issued ? (
                                  <button
                                    type="button"
                                    onClick={() => handleDownloadExistingCertificate(row)}
                                    className="px-3 py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100"
                                  >
                                    Download PDF
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => openCertificateModal(row)}
                                    className="px-3 py-2 rounded-lg bg-[#181FC5] text-white text-xs font-bold hover:bg-[#1418a0]"
                                  >
                                    Issue Certificate
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "offer-letters" && (
            <OfferLetterPanel
              initialEmail={offerLetterPrefill.email}
              initialName={offerLetterPrefill.name}
            />
          )}

          {activeTab === "operations" && (
            <div className="grid lg:grid-cols-2 gap-6">
              <form onSubmit={handleAssignStudent} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-[#181FC5]" /> Assign Student
                </h2>
                <input
                  type="email"
                  required
                  placeholder="Student email"
                  value={studentForm.studentEmail}
                  onChange={(e) => setStudentForm({ ...studentForm, studentEmail: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                />
                <select
                  required
                  value={studentForm.internshipSlug}
                  onChange={(e) => setStudentForm({ ...studentForm, internshipSlug: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                >
                  <option value="">Select internship program</option>
                  {programs.map((p) => (
                    <option key={p.slug} value={p.slug}>{p.title}</option>
                  ))}
                </select>
                <input
                  type="email"
                  placeholder="Trainer email (optional)"
                  value={studentForm.trainerEmail}
                  onChange={(e) => setStudentForm({ ...studentForm, trainerEmail: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                />
                <button type="submit" className="w-full py-3 rounded-xl bg-[#181FC5] text-white font-bold hover:bg-[#1418a0]">
                  Assign Student
                </button>
              </form>

              <form onSubmit={handleAssignTrainer} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#181FC5]" /> Assign Trainer
                </h2>
                <input
                  type="email"
                  required
                  placeholder="Trainer email"
                  value={trainerForm.trainerEmail}
                  onChange={(e) => setTrainerForm({ ...trainerForm, trainerEmail: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                />
                <select
                  required
                  value={trainerForm.internshipSlug}
                  onChange={(e) => setTrainerForm({ ...trainerForm, internshipSlug: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                >
                  <option value="">Select internship program</option>
                  {programs.map((p) => (
                    <option key={p.slug} value={p.slug}>{p.title}</option>
                  ))}
                </select>
                <button type="submit" className="w-full py-3 rounded-xl bg-[#181FC5] text-white font-bold hover:bg-[#1418a0]">
                  Assign Trainer
                </button>
              </form>

              <form onSubmit={handleSetRole} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-4 lg:col-span-2 max-w-xl">
                <h2 className="text-lg font-extrabold text-slate-900">Set User Role</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="email"
                    required
                    placeholder="User email"
                    value={roleForm.email}
                    onChange={(e) => setRoleForm({ ...roleForm, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                  />
                  <select
                    value={roleForm.role}
                    onChange={(e) => setRoleForm({ ...roleForm, role: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                  >
                    <option value="trainer">Trainer</option>
                    <option value="admin">Admin</option>
                    <option value="student">Student</option>
                  </select>
                </div>
                <button type="submit" className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800">
                  Update Role
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {certificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <h3 className="text-xl font-extrabold text-slate-900 mb-1">Issue Internship Certificate</h3>
            <p className="text-sm text-slate-600 mb-5">
              {certificateModal.programTitle} · {certificateModal.studentEmail}
            </p>
            {certificateModal.alreadyIssued ? (
              <p className="text-sm text-emerald-700 bg-emerald-50 rounded-xl p-4 mb-4">
                Certificate already issued. UUID: {certificateModal.uuid}
              </p>
            ) : (
              <label className="block mb-5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">
                  Name on certificate
                </span>
                <input
                  value={certificateModal.studentName}
                  onChange={(e) =>
                    setCertificateModal({ ...certificateModal, studentName: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                  placeholder="Student full name"
                />
              </label>
            )}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setCertificateModal(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm"
              >
                Cancel
              </button>
              {!certificateModal.alreadyIssued && (
                <button
                  type="button"
                  onClick={handleIssueCertificate}
                  disabled={issuingId === certificateModal.enrollmentId}
                  className="px-4 py-2.5 rounded-xl bg-[#181FC5] text-white font-bold text-sm hover:bg-[#1418a0] disabled:opacity-60"
                >
                  {issuingId === certificateModal.enrollmentId ? "Issuing..." : "Issue & Download PDF"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </BaseLayout>
  );
}

export default AdminInternshipDashboard;
