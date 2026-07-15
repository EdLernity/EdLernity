import api from "./api";

export type UserRole = "student" | "trainer" | "admin" | "manager" | "intern";

export interface CrmUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: UserRole;
  isVerified: boolean;
  isBlocked: boolean;
  createdAt: string;
}

export interface InternKycProfile {
  fullName: string;
  email: string;
  phone: string;
  collegeName: string;
  programName: string;
  photoUrl: string;
  twelfthCertificateUrl: string;
  aadharFrontUrl: string;
  aadharBackUrl: string;
  collegeIdUrl: string;
  submittedAt: string;
  approvalStatus?: "pending" | "approved" | "rejected";
  approvedAt?: string | null;
  rejectionReason?: string;
  rejectedAt?: string | null;
}

export interface IssuedInternCertificate {
  id: string;
  uuid: string;
  studentName: string;
  programTitle: string;
  templateId?: string | null;
  templateLabel: string;
  certificateType: string;
  issuedAt: string;
  fromDate?: string | null;
  toDate?: string | null;
}

export interface InternProfileRow {
  id: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role?: string;
    isBlocked: boolean;
    isActive?: boolean;
    joinedAt: string;
  };
  kyc: InternKycProfile | null;
  enrollment: {
    internshipSlug: string;
    programTitle: string;
    enrolledAt: string;
    enrollmentSource: string;
    active?: boolean;
    certificateTemplateId?: string | null;
    certificateTemplateLabel?: string | null;
  } | null;
  certificates?: IssuedInternCertificate[];
  certificateEligibleAt?: string | null;
  certificateUnlocked?: boolean;
  courseCompletionUnlocked?: boolean;
  certificateLockDaysRemaining?: number;
  certificateLockDays?: number;
  internshipCompleted?: boolean;
  internshipCompletedAt?: string | null;
  internshipCompletedOverride?: boolean;
  awaitingInternshipCertificate?: boolean;
  completionCertificate?: IssuedInternCertificate | null;
  certificate: {
    issued: boolean;
    uuid?: string;
    studentName?: string;
    programTitle?: string;
    issuedAt?: string;
  };
}

export interface EnrollmentRow {
  id: string;
  student: { _id: string; firstName: string; lastName: string; email: string; phone?: string };
  trainer: { firstName: string; lastName: string; email: string } | null;
  internshipSlug: string;
  programTitle: string;
  enrolledAt: string;
  enrollmentSource: string;
  certificate: { issued: boolean; uuid?: string; studentName?: string; issuedAt?: string };
}

export interface CertificateRow {
  id: string;
  recordType: "internship-completion" | "course-completion";
  uuid: string;
  studentName: string;
  programTitle: string;
  internshipSlug?: string;
  courseId?: string | null;
  issuedAt: string;
  student: { id: string; email: string; name: string } | null;
  issuedBy?: { email: string; name: string } | null;
}

export type CertificateTemplateType = string;

export interface CertificateTypeRow {
  id: string;
  slug: string;
  label: string;
  kind: "certificate" | "offer-letter";
  description: string;
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CertificateTemplateRow {
  id: string;
  type: string;
  label: string;
  pdfUrl: string;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export const CERTIFICATE_TYPE_LABELS: Record<string, string> = {
  "internship-completion": "Internship Completion",
  "course-completion": "Course Completion",
  "offer-letter-hr": "Offer Letter (HR)",
  "offer-letter-marketing": "Offer Letter (Marketing)",
};

export function normalizeTypeSlug(value: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function certificateTypeLabel(slug: string, types?: CertificateTypeRow[]) {
  const match = types?.find((row) => row.slug === slug);
  return match?.label || CERTIFICATE_TYPE_LABELS[slug] || slug;
}

export interface TransactionRow {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  paymentId: string;
  amount: string;
  date: string;
  internshipSlug?: string | null;
  source?: string;
}

export interface MonthlySalesRow {
  key: string;
  label: string;
  year: number;
  month: number;
  total: number;
  count: number;
  bySource: {
    internship: { total: number; count: number };
    course: { total: number; count: number };
    membership: { total: number; count: number };
  };
}

export interface TransactionsResponse {
  transactions: TransactionRow[];
  summary: {
    totalRevenue: number;
    transactionCount: number;
    breakdownRevenue: number;
    breakdownCount: number;
    filter: {
      date: string | null;
      month: string | null;
      year: string | null;
      source: string;
      search: string | null;
    };
  };
  monthlyBreakdown: MonthlySalesRow[];
  availableYears: number[];
}

export interface InternInviteRow {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  internshipSlug: string;
  programTitle: string;
  status: string;
  inviteUrl: string;
  expiresAt: string;
  acceptedAt?: string | null;
  password?: string | null;
  onboardingPassword?: string | null;
  approvalStatus?: "pending" | "approved" | "rejected" | null;
  kyc?: InternKycProfile | null;
  inviteMessage?: string;
  createdAt: string;
  user?: { id: string; name: string; email: string } | null;
}

export interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  effectiveRole?: UserRole;
}

export async function login(email: string, password: string) {
  try {
    const { data } = await api.post("/auth/login", { email, password });
    return data as { success: boolean; token?: string; message?: string };
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    return {
      success: false,
      message: axiosError.response?.data?.message || "Login failed. Please try again.",
    };
  }
}

export async function fetchUserDetails() {
  const { data } = await api.get("/auth/user-details");
  return data.user as UserProfile;
}

export async function fetchOverview() {
  const { data } = await api.get("/api/v1/crm/overview");
  return data as {
    stats: {
      totalUsers: number;
      usersByRole: { student: number; trainer: number; admin: number; manager?: number };
      verifiedUsers: number;
      blockedUsers: number;
      totalEnrollments: number;
      enrollmentsThisMonth: number;
      totalCertificates: number;
      totalRevenue: number;
      transactionCount: number;
    };
    recentUsers: Array<{ id: string; name: string; email: string; role: string; createdAt: string }>;
  };
}

export async function fetchUsers(params: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  blocked?: string;
}) {
  const { data } = await api.get("/api/v1/crm/users", { params });
  return data as {
    users: CrmUser[];
    pagination: { page: number; limit: number; total: number; pages: number };
  };
}

export async function updateUserRole(userId: string, role: UserRole) {
  const { data } = await api.patch(`/api/v1/crm/users/${userId}/role`, { role });
  return data;
}

export async function updateUserBlock(userId: string, blocked: boolean) {
  const { data } = await api.patch(`/api/v1/crm/users/${userId}/block`, { blocked });
  return data;
}

export async function fetchInterns(includeInactive = false) {
  const { data } = await api.get("/api/v1/crm/interns", {
    params: includeInactive ? { includeInactive: true } : undefined,
  });
  return (data.interns || []) as InternProfileRow[];
}

/** Trainer-completed students awaiting manager certificate issue (all roles). */
export async function fetchInternshipApprovals(status: "pending" | "issued" | "all" = "pending") {
  const { data } = await api.get("/api/v1/crm/internship-approvals", {
    params: { status },
  });
  return data as {
    approvals: InternProfileRow[];
    summary: { pending: number; issued: number };
  };
}

export async function blockIntern(userId: string, blocked: boolean) {
  const { data } = await api.patch(`/api/v1/crm/interns/${userId}/block`, { blocked });
  return data;
}

export async function deactivateIntern(userId: string, internshipSlug?: string) {
  const { data } = await api.delete(`/api/v1/crm/interns/${userId}`, {
    data: internshipSlug ? { internshipSlug } : undefined,
  });
  return data;
}

/** @deprecated Use deactivateIntern */
export async function deleteIntern(userId: string, internshipSlug?: string) {
  return deactivateIntern(userId, internshipSlug);
}

export async function reactivateIntern(userId: string, internshipSlug?: string) {
  const { data } = await api.post(`/api/v1/crm/interns/${userId}/reactivate`, {
    internshipSlug,
  });
  return data;
}

export async function approveIntern(userId: string, internshipSlug?: string) {
  const { data } = await api.post(`/api/v1/crm/interns/${userId}/approve`, { internshipSlug });
  return data;
}

export async function rejectIntern(userId: string, reason?: string, internshipSlug?: string) {
  const { data } = await api.post(`/api/v1/crm/interns/${userId}/reject`, { reason, internshipSlug });
  return data;
}

export async function approveInternCertificate(
  userId: string,
  studentName?: string,
  internshipSlug?: string,
  certificateTemplateId?: string,
  issuedAt?: string,
  options?: { fromDate?: string; toDate?: string }
) {
  const { data } = await api.post(`/api/v1/crm/interns/${userId}/approve-certificate`, {
    studentName,
    internshipSlug,
    certificateTemplateId,
    issuedAt: options?.toDate || issuedAt,
    fromDate: options?.fromDate,
    toDate: options?.toDate,
  });
  return data;
}

export async function previewInternshipCertificateDraft(payload: {
  studentId: string;
  internshipSlug: string;
  certificateTemplateId: string;
  studentName: string;
  fromDate: string;
  toDate: string;
}) {
  const response = await api.post("/api/v1/crm/internship-approvals/preview-pdf", payload, {
    responseType: "blob",
  });
  return response.data as Blob;
}

export async function fetchOfferLetterPdfBlob(offerLetterId: string) {
  const response = await api.get(`/api/v1/crm/my/offer-letters/${offerLetterId}/pdf`, {
    responseType: "blob",
  });
  return response.data as Blob;
}

export async function fetchCertificatePdfBlob(certificateId: string) {
  const response = await api.get(`/api/v1/crm/my/certificates/${certificateId}/pdf`, {
    responseType: "blob",
  });
  return response.data as Blob;
}

export async function fetchCertificates(params?: { type?: string }) {
  const { data } = await api.get("/api/v1/crm/certificates", { params });
  return (data.certificates || []) as CertificateRow[];
}

export async function fetchCertificateTemplates(params?: { type?: string; issuable?: boolean }) {
  const { data } = await api.get("/api/v1/crm/certificate-templates", { params });
  return {
    templates: (data.templates || []) as CertificateTemplateRow[],
    types: (data.types || []) as string[],
    typeRows: (data.typeRows || []) as CertificateTypeRow[],
  };
}

export async function fetchCertificateTypes(params?: { kind?: string; includeInactive?: boolean }) {
  const { data } = await api.get("/api/v1/crm/certificate-types", {
    params: {
      kind: params?.kind,
      includeInactive: params?.includeInactive ? "true" : undefined,
    },
  });
  return (data.types || []) as CertificateTypeRow[];
}

export async function createCertificateType(payload: {
  slug?: string;
  label: string;
  kind?: "certificate" | "offer-letter";
  description?: string;
  sortOrder?: number;
  active?: boolean;
}) {
  const { data } = await api.post("/api/v1/crm/certificate-types", payload);
  return data.type as CertificateTypeRow;
}

export async function updateCertificateType(
  id: string,
  payload: {
    label?: string;
    kind?: "certificate" | "offer-letter";
    description?: string;
    sortOrder?: number;
    active?: boolean;
  }
) {
  const { data } = await api.patch(`/api/v1/crm/certificate-types/${id}`, payload);
  return data.type as CertificateTypeRow;
}

export async function deleteCertificateType(id: string) {
  const { data } = await api.delete(`/api/v1/crm/certificate-types/${id}`);
  return data;
}

export async function uploadCertificateTemplatePdf(file: File) {
  const formData = new FormData();
  formData.append("pdf", file);
  const { data } = await api.post("/api/v1/crm/certificate-templates/upload-pdf", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.pdfUrl as string;
}

export async function createCertificateTemplate(payload: {
  type: CertificateTemplateType;
  label: string;
  pdfUrl: string;
  description?: string;
  active?: boolean;
}) {
  const { data } = await api.post("/api/v1/crm/certificate-templates", payload);
  return data;
}

export async function updateCertificateTemplate(
  id: string,
  payload: Partial<{
    type: CertificateTemplateType;
    label: string;
    pdfUrl: string;
    description: string;
    active: boolean;
  }>
) {
  const { data } = await api.patch(`/api/v1/crm/certificate-templates/${id}`, payload);
  return data;
}

export async function deleteCertificateTemplate(id: string) {
  const { data } = await api.delete(`/api/v1/crm/certificate-templates/${id}`);
  return data;
}

export async function deleteIssuedCertificate(id: string, recordType: CertificateRow["recordType"]) {
  const { data } = await api.delete(`/api/v1/crm/certificates/${id}`, {
    params: { recordType },
  });
  return data;
}

export async function fetchCertificateTemplatePreviewBlob(templateId: string) {
  const response = await api.get(`/api/v1/crm/certificate-templates/${templateId}/preview`, {
    responseType: "blob",
  });
  return response.data as Blob;
}

export async function fetchCertificatePreviewBlob(
  id: string,
  recordType: CertificateRow["recordType"]
) {
  const response = await api.get(`/api/v1/crm/certificates/${id}/preview`, {
    params: { recordType },
    responseType: "blob",
  });
  return response.data as Blob;
}

export async function fetchTransactions(params?: {
  date?: string;
  month?: string;
  year?: string;
  source?: string;
  search?: string;
}) {
  const { data } = await api.get("/api/v1/crm/transactions", { params });
  return data as TransactionsResponse;
}

export async function fetchAdminPrograms() {
  const { data } = await api.get("/api/v1/internship-admin/programs");
  return data.programs as Array<{ slug: string; title: string; track?: "careers" | "paid-tech" }>;
}

export async function fetchCareersPrograms() {
  const { data } = await api.get("/api/v1/internship-admin/programs", { params: { track: "careers" } });
  return data.programs as Array<{ slug: string; title: string; track?: "careers" | "paid-tech" }>;
}

export interface CareersProgramRow {
  id: string;
  slug: string;
  title: string;
  category: string;
  track: "careers";
  trackLabel?: string;
  description?: string;
  highlights?: string[];
  coverImage?: string;
  applyUrl?: string;
  location?: string;
  duration?: string;
  preferred?: boolean;
  preferredNote?: string;
  active?: boolean;
  sortOrder?: number;
  certificateTemplateId?: string | null;
  offerLetterTemplateId?: string | null;
  offerLetterRoleDescription?: string;
  certificateTemplate?: { id: string; label: string; type: string } | null;
  offerLetterTemplate?: { id: string; label: string; type: string } | null;
  createdAt?: string;
  updatedAt?: string;
}

export type CareersProgramPayload = {
  title: string;
  slug?: string;
  category?: string;
  trackLabel?: string;
  description?: string;
  highlights?: string[];
  coverImage?: string;
  applyUrl?: string;
  location?: string;
  duration?: string;
  preferred?: boolean;
  preferredNote?: string;
  active?: boolean;
  sortOrder?: number;
  certificateTemplateId?: string | null;
  offerLetterTemplateId?: string | null;
  offerLetterRoleDescription?: string;
};

export async function fetchAdminCareersPrograms() {
  const { data } = await api.get("/api/v1/crm/careers-programs");
  return data.programs as CareersProgramRow[];
}

export async function createCareersProgram(payload: CareersProgramPayload) {
  const { data } = await api.post("/api/v1/crm/careers-programs", payload);
  return data;
}

export async function updateCareersProgram(id: string, payload: Partial<CareersProgramPayload>) {
  const { data } = await api.patch(`/api/v1/crm/careers-programs/${id}`, payload);
  return data;
}

export async function deleteCareersProgram(id: string) {
  const { data } = await api.delete(`/api/v1/crm/careers-programs/${id}`);
  return data;
}

export function groupProgramsByTrack(
  programs: Array<{ slug: string; title: string; track?: "careers" | "paid-tech" }>
) {
  return {
    careers: programs.filter((p) => p.track === "careers"),
    paidTech: programs.filter((p) => p.track === "paid-tech"),
  };
}

export async function fetchAdminTrainers() {
  const { data } = await api.get("/api/v1/internship-admin/trainers");
  return data.trainers as Array<{
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role?: string;
  }>;
}

export interface TrainerAssignmentRow {
  id: string;
  internshipSlug: string;
  programTitle: string;
  active: boolean;
  assignedAt: string;
  updatedAt: string;
  trainer: {
    id: string;
    email: string;
    name: string;
    role?: string;
  };
  assignedBy: { email: string; name: string } | null;
}

export async function fetchTrainerAssignments() {
  const { data } = await api.get("/api/v1/internship-admin/trainer-assignments");
  return (data.assignments || []) as TrainerAssignmentRow[];
}

export async function assignTrainer(payload: { trainerEmail: string; internshipSlug: string }) {
  const { data } = await api.post("/api/v1/internship-admin/assign-trainer", payload);
  return data;
}

export async function unassignTrainer(payload: {
  assignmentId?: string;
  trainerEmail?: string;
  internshipSlug?: string;
}) {
  const { data } = await api.post("/api/v1/internship-admin/unassign-trainer", payload);
  return data;
}

export async function assignStudent(payload: {
  studentEmail: string;
  internshipSlug: string;
  trainerEmail?: string;
}) {
  const { data } = await api.post("/api/v1/internship-admin/assign-student", payload);
  return data;
}

export async function setUserRoleByEmail(payload: { email: string; role: UserRole }) {
  const { data } = await api.post("/api/v1/internship-admin/set-role", payload);
  return data;
}

export async function issueInternshipCertificate(payload: {
  studentEmail: string;
  internshipSlug: string;
  studentName: string;
}) {
  const { data } = await api.post("/api/v1/internship-admin/issue-certificate", payload);
  return data;
}

export async function sendOfferLetter(formData: FormData) {
  const { data } = await api.post("/api/v1/course/offer-letter", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function recordOfferLetter(payload: {
  userEmail: string;
  internshipSlug: string;
  candidateName: string;
  templateId?: string;
  templateLabel?: string;
}) {
  const { data } = await api.post("/api/v1/crm/offer-letters/record", payload);
  return data;
}

export async function fetchIssuedOfferLetters() {
  const { data } = await api.get("/api/v1/crm/offer-letters");
  return (data.offerLetters || []) as Array<{
    id: string;
    candidateName: string;
    internshipSlug: string;
    templateLabel: string;
    issuedAt: string;
    user: { email: string; name: string } | null;
  }>;
}

export async function fetchInvites() {
  const { data } = await api.get("/api/v1/crm/invites");
  return (data.invites || []) as InternInviteRow[];
}

export async function createInvite(payload: {
  email: string;
  firstName?: string;
  lastName?: string;
  internshipSlug?: string;
  inviteMessage?: string;
}) {
  const { data } = await api.post("/api/v1/crm/invites", payload);
  return data;
}

export async function createInviteBulk(payload: {
  emails: string[];
  firstName?: string;
  lastName?: string;
  internshipSlug?: string;
  inviteMessage?: string;
}) {
  const { data } = await api.post("/api/v1/crm/invites/bulk", payload);
  return data as {
    message: string;
    sent: Array<{ id: string; email: string; inviteUrl: string }>;
    failed: Array<{ email: string; reason: string }>;
  };
}

export async function deleteInvite(inviteId: string) {
  const { data } = await api.delete(`/api/v1/crm/invites/${inviteId}`);
  return data;
}

export async function deleteUser(userId: string) {
  const { data } = await api.delete(`/api/v1/crm/users/${userId}`);
  return data;
}

export interface MyOfferLetterRow {
  id: string;
  internshipSlug: string;
  candidateName: string;
  templateLabel: string;
  issuedAt: string;
}

export interface MyCertificateRow {
  id: string;
  uuid: string;
  studentName: string;
  programTitle: string;
  internshipSlug: string;
  templateLabel?: string;
  issuedAt: string;
}

export async function fetchMyOfferLetters() {
  const { data } = await api.get("/api/v1/crm/my/offer-letters");
  return (data.offerLetters || []) as MyOfferLetterRow[];
}

export async function fetchMyCertificates() {
  const { data } = await api.get("/api/v1/crm/my/certificates");
  return (data.certificates || []) as MyCertificateRow[];
}

export interface MyKycStatus {
  fullName: string;
  email: string;
  phone: string;
  collegeName: string;
  programName: string;
  approvalStatus: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  rejectedAt?: string | null;
  submittedAt?: string;
}

export async function fetchMyKycStatus() {
  const { data } = await api.get("/api/v1/crm/my/kyc-status");
  return (data.kyc || null) as MyKycStatus | null;
}

export async function resubmitKyc(formData: FormData) {
  const { data } = await api.post("/api/v1/crm/my/kyc/resubmit", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export interface TrainerProgramRow {
  slug: string;
  title: string;
  category?: string;
  coverImage?: string;
  studentCount?: number;
}

export interface TrainerStudentRow {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export type TrainerProgramConfig = Record<string, any>;

export async function fetchTrainerPrograms() {
  const { data } = await api.get("/api/v1/internship-trainer/programs");
  return (data.programs || []) as TrainerProgramRow[];
}

export async function fetchTrainerProgramConfig(slug: string) {
  const { data } = await api.get(`/api/v1/internship-trainer/programs/${slug}/config`);
  return data.config as TrainerProgramConfig;
}

export async function saveTrainerProgramConfig(slug: string, payload: Record<string, unknown>) {
  const { data } = await api.put(`/api/v1/internship-trainer/programs/${slug}/config`, payload);
  return data.config as TrainerProgramConfig;
}

export async function fetchTrainerStudents(slug: string) {
  const { data } = await api.get(`/api/v1/internship-trainer/programs/${slug}/students`);
  return (data.students || []) as TrainerStudentRow[];
}

export interface TrainerProgressStudent {
  id: string;
  name: string;
  email: string;
  phone?: string;
  assignedAt?: string;
  assignmentsDone: number;
  assignmentsSubmitted?: number;
  assignmentsTotal: number;
  projectsDone: number;
  projectsSubmitted?: number;
  projectsTotal: number;
  attendanceDone?: number;
  attendanceTotal?: number;
  assignmentCompletionPercent: number;
  projectCompletionPercent: number;
  internshipCompleted?: boolean;
  internshipCompletedAt?: string | null;
  internshipCompletedOverride?: boolean;
  eligibleForCompletion?: boolean;
  assignments: Array<{
    key: string;
    weekIndex: number;
    classId: string;
    title: string;
    weekLabel: string;
    classTitle: string;
    submitted: boolean;
    submittedAt?: string | null;
    mcqScore?: number | null;
    mcqTotal?: number | null;
    passingScore?: number | null;
    passed?: boolean | null;
    status?: "pending" | "passed" | "failed";
  }>;
  projects: Array<{
    key: string;
    weekIndex: number;
    title: string;
    weekLabel: string;
    topic?: string;
    submitted: boolean;
    submittedAt?: string | null;
    githubUrl?: string;
    reviewStatus?: "pending" | "approved" | "rejected" | null;
    reviewReason?: string;
    reviewedAt?: string | null;
    approved?: boolean;
  }>;
  attendance?: Array<{
    key: string;
    weekIndex: number;
    classId: string;
    title: string;
    weekLabel: string;
    attended: boolean;
    joinedAt?: string | null;
    lastJoinedAt?: string | null;
    joinCount?: number;
  }>;
}

export async function fetchTrainerProgramProgress(slug: string) {
  const { data } = await api.get(`/api/v1/internship-trainer/programs/${slug}/progress`);
  return data as {
    summary: {
      studentCount: number;
      assignmentCount: number;
      projectCount: number;
      studentsWithAllAssignments: number;
      studentsWithAllProjects: number;
      internshipCompletedCount?: number;
      eligibleForCompletionCount?: number;
    };
    expected: {
      assignments: any[];
      projects: any[];
    };
    students: TrainerProgressStudent[];
  };
}

export async function reviewTrainerProject(
  slug: string,
  payload: {
    studentId: string;
    weekIndex: number;
    status: "approved" | "rejected" | "pending";
    reason?: string;
  }
) {
  const { data } = await api.post(
    `/api/v1/internship-trainer/programs/${slug}/projects/review`,
    payload
  );
  return data;
}

export async function completeTrainerInternship(
  slug: string,
  studentId: string,
  options?: { override?: boolean }
) {
  const { data } = await api.post(
    `/api/v1/internship-trainer/programs/${slug}/complete-internship`,
    { studentId, override: Boolean(options?.override) }
  );
  return data;
}

export async function completeTrainerInternshipBulk(
  slug: string,
  studentIds: string[],
  options?: { override?: boolean }
) {
  const { data } = await api.post(
    `/api/v1/internship-trainer/programs/${slug}/complete-internship/bulk`,
    { studentIds, override: Boolean(options?.override) }
  );
  return data as {
    message: string;
    completed: Array<{
      studentId: string;
      internshipCompletedAt?: string;
      internshipCompletedOverride?: boolean;
    }>;
    skipped: Array<{ studentId: string; reason: string }>;
  };
}

export interface TrainerAssessmentProgramSummary {
  slug: string;
  title: string;
  category?: string;
  coverImage?: string;
  studentCount: number;
  assignmentCount: number;
  submissionTotal: number;
  submittedCount: number;
  pendingCount: number;
  completionPercent: number;
}

export interface TrainerAssessmentRow {
  id: string;
  internshipSlug: string;
  programTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  phone?: string;
  weekIndex: number;
  weekLabel: string;
  topic?: string;
  classId: string;
  classTitle: string;
  assignmentTitle: string;
  questionCount: number;
  submitted: boolean;
  submittedAt?: string | null;
  mcqScore?: number | null;
  mcqTotal?: number | null;
  passingScore?: number | null;
  passed?: boolean | null;
  status?: "pending" | "passed" | "failed";
}

export interface TrainerAssessmentClassOption {
  key: string;
  slug: string;
  programTitle: string;
  weekIndex: number;
  weekLabel: string;
  topic?: string;
  classId: string;
  classTitle: string;
  assignmentTitle: string;
  questionCount?: number;
}

export interface TrainerAssessmentDetail {
  internshipSlug: string;
  programTitle: string;
  student: { id: string; name: string; email: string; phone?: string };
  assignment: {
    weekIndex: number;
    weekLabel: string;
    topic?: string;
    classId: string;
    classTitle: string;
    title: string;
    instructions?: string;
    dueLabel?: string;
  };
  submitted: boolean;
  submittedAt?: string | null;
  mcqScore?: number | null;
  mcqTotal?: number | null;
  passingScore?: number | null;
  passed?: boolean | null;
  questions: Array<{
    id: string;
    type: "mcq" | "text";
    prompt: string;
    options: string[];
    correctOptionIndex: number;
    selectedIndex: number | null;
    textAnswer: string;
    isCorrect: boolean | null;
  }>;
}

export async function fetchTrainerAssessments(params?: {
  slug?: string;
  status?: "all" | "submitted" | "pending";
  classKey?: string;
  q?: string;
}) {
  const { data } = await api.get("/api/v1/internship-trainer/assessments", {
    params: {
      slug: params?.slug || undefined,
      status: params?.status || "all",
      classKey: params?.classKey || undefined,
      q: params?.q || undefined,
    },
  });
  return data as {
    programs: TrainerAssessmentProgramSummary[];
    classes: TrainerAssessmentClassOption[];
    summary: { total: number; submitted: number; pending: number };
    rows: TrainerAssessmentRow[];
  };
}

export interface TrainerProjectAssessmentProgramSummary {
  slug: string;
  title: string;
  category?: string;
  coverImage?: string;
  studentCount: number;
  projectCount: number;
  submissionTotal: number;
  submittedCount: number;
  pendingCount: number;
  approvedCount: number;
  awaitingReviewCount: number;
  rejectedCount: number;
  completionPercent: number;
}

export interface TrainerProjectAssessmentOption {
  key: string;
  slug: string;
  programTitle: string;
  weekIndex: number;
  weekLabel: string;
  topic?: string;
  title: string;
  documentUrl?: string;
  documentTitle?: string;
  spanWeeks?: number;
}

export interface TrainerProjectAssessmentRow {
  id: string;
  internshipSlug: string;
  programTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  phone?: string;
  weekIndex: number;
  weekLabel: string;
  topic?: string;
  title: string;
  documentUrl?: string;
  documentTitle?: string;
  spanWeeks?: number;
  submitted: boolean;
  submittedAt?: string | null;
  githubUrl?: string;
  reviewStatus?: "pending" | "approved" | "rejected" | null;
  reviewReason?: string;
  reviewedAt?: string | null;
  approved?: boolean;
}

export async function fetchTrainerProjectAssessments(params?: {
  slug?: string;
  status?:
    | "all"
    | "submitted"
    | "pending"
    | "awaiting_review"
    | "approved"
    | "rejected";
  projectKey?: string;
  q?: string;
}) {
  const { data } = await api.get("/api/v1/internship-trainer/assessments/projects", {
    params: {
      slug: params?.slug || undefined,
      status: params?.status || "all",
      projectKey: params?.projectKey || undefined,
      q: params?.q || undefined,
    },
  });
  return data as {
    programs: TrainerProjectAssessmentProgramSummary[];
    projects: TrainerProjectAssessmentOption[];
    summary: {
      total: number;
      submitted: number;
      pending: number;
      awaitingReview: number;
      approved: number;
      rejected: number;
    };
    rows: TrainerProjectAssessmentRow[];
  };
}

export async function fetchTrainerAssessmentDetail(params: {
  slug: string;
  studentId: string;
  weekIndex: number;
  classId: string;
}) {
  const { data } = await api.get(
    `/api/v1/internship-trainer/assessments/${params.slug}/detail`,
    {
      params: {
        studentId: params.studentId,
        weekIndex: params.weekIndex,
        classId: params.classId,
      },
    }
  );
  return data as TrainerAssessmentDetail;
}

export async function generateTrainerClassQuestions(
  slug: string,
  classId: string,
  payload: {
    weekIndex: number;
    numMcq: number;
    numText: number;
    difficulty: string;
    focus?: string;
    contextText?: string;
    contextPdf?: File | null;
  }
) {
  const formData = new FormData();
  formData.append("weekIndex", String(payload.weekIndex));
  formData.append("numMcq", String(payload.numMcq));
  formData.append("numText", String(payload.numText));
  formData.append("difficulty", payload.difficulty || "medium");
  if (payload.focus) formData.append("focus", payload.focus);
  if (payload.contextText) formData.append("contextText", payload.contextText);
  if (payload.contextPdf) formData.append("contextPdf", payload.contextPdf);

  const { data } = await api.post(
    `/api/v1/internship-trainer/programs/${slug}/classes/${encodeURIComponent(classId)}/generate-questions`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data as {
    questions: any[];
    classId: string;
    weekIndex: number;
    usedContext?: { hasText: boolean; hasPdf: boolean };
  };
}

