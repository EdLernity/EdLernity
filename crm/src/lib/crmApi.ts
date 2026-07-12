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
}

export interface InternProfileRow {
  id: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    isBlocked: boolean;
    joinedAt: string;
  };
  kyc: InternKycProfile | null;
  enrollment: {
    internshipSlug: string;
    programTitle: string;
    enrolledAt: string;
    enrollmentSource: string;
    certificateTemplateId?: string | null;
    certificateTemplateLabel?: string | null;
  } | null;
  certificates?: IssuedInternCertificate[];
  certificateEligibleAt?: string | null;
  certificateUnlocked?: boolean;
  certificateLockDaysRemaining?: number;
  certificateLockDays?: number;
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

export async function fetchInterns() {
  const { data } = await api.get("/api/v1/crm/interns");
  return (data.interns || []) as InternProfileRow[];
}

export async function blockIntern(userId: string, blocked: boolean) {
  const { data } = await api.patch(`/api/v1/crm/interns/${userId}/block`, { blocked });
  return data;
}

export async function deleteIntern(userId: string) {
  const { data } = await api.delete(`/api/v1/crm/interns/${userId}`);
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
  certificateTemplateId?: string
) {
  const { data } = await api.post(`/api/v1/crm/interns/${userId}/approve-certificate`, {
    studentName,
    internshipSlug,
    certificateTemplateId,
  });
  return data;
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
  return data.trainers as Array<{ _id: string; firstName: string; lastName: string; email: string }>;
}

export async function assignTrainer(payload: { trainerEmail: string; internshipSlug: string }) {
  const { data } = await api.post("/api/v1/internship-admin/assign-trainer", payload);
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
