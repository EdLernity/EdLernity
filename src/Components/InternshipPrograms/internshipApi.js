import { apiInstancePrivate } from "../../Utils/AxiosInstance";

export async function fetchStudentDashboard(slug) {
  const { data } = await apiInstancePrivate.get(`/api/v1/enroll/internships/${slug}/dashboard`);
  return data;
}

export async function fetchAdminPrograms() {
  const { data } = await apiInstancePrivate.get("/api/v1/internship-admin/programs");
  return data.programs || [];
}

export async function fetchAdminTrainers() {
  const { data } = await apiInstancePrivate.get("/api/v1/internship-admin/trainers");
  return data.trainers || [];
}

export async function fetchAdminEnrollments() {
  const { data } = await apiInstancePrivate.get("/api/v1/internship-admin/enrollments");
  return data.enrollments || [];
}

export async function assignStudentToInternship(payload) {
  const { data } = await apiInstancePrivate.post("/api/v1/internship-admin/assign-student", payload);
  return data;
}

export async function assignTrainerToProgram(payload) {
  const { data } = await apiInstancePrivate.post("/api/v1/internship-admin/assign-trainer", payload);
  return data;
}

export async function setUserRole(payload) {
  const { data } = await apiInstancePrivate.post("/api/v1/internship-admin/set-role", payload);
  return data;
}

export async function issueInternshipCertificate(payload) {
  const { data } = await apiInstancePrivate.post("/api/v1/internship-admin/issue-certificate", payload);
  return data;
}

export async function fetchTrainerPrograms() {
  const { data } = await apiInstancePrivate.get("/api/v1/internship-trainer/programs");
  return data.programs || [];
}

export async function fetchTrainerProgramConfig(slug) {
  const { data } = await apiInstancePrivate.get(`/api/v1/internship-trainer/programs/${slug}/config`);
  return data.config;
}

export async function saveTrainerProgramConfig(slug, payload) {
  const { data } = await apiInstancePrivate.put(
    `/api/v1/internship-trainer/programs/${slug}/config`,
    payload
  );
  return data.config;
}

export async function fetchTrainerStudents(slug) {
  const { data } = await apiInstancePrivate.get(`/api/v1/internship-trainer/programs/${slug}/students`);
  return data.students || [];
}

export async function submitClassAssignment(slug, classId, payload) {
  const { data } = await apiInstancePrivate.post(
    `/api/v1/enroll/internships/${slug}/assignments/${encodeURIComponent(classId)}/submit`,
    payload
  );
  return data;
}

export async function submitProjectGithub(slug, weekIndex, githubUrl) {
  const { data } = await apiInstancePrivate.post(
    `/api/v1/enroll/internships/${slug}/projects/${weekIndex}/submit`,
    { githubUrl }
  );
  return data;
}

/** Mark attendance when the student clicks Join Live Class. */
export async function markLiveClassAttendance(slug, classId, weekIndex) {
  const { data } = await apiInstancePrivate.post(
    `/api/v1/enroll/internships/${slug}/classes/${encodeURIComponent(classId)}/attend`,
    { weekIndex }
  );
  return data;
}

/** Issued internship certificate filled onto the manager/admin PDF template. */
export async function fetchStudentCertificatePdfBlob(slug) {
  const response = await apiInstancePrivate.get(
    `/api/v1/enroll/internships/${slug}/certificate/pdf`,
    { responseType: "blob" }
  );
  return response.data;
}
