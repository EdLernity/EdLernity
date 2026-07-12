import axios from "axios";
import { BACKEND_URL } from "./authStorage";

const publicApi = axios.create({
  baseURL: BACKEND_URL,
  headers: { "Content-Type": "application/json" },
});

export type InviteDetails = {
  email: string;
  firstName: string;
  lastName: string;
  internshipSlug: string;
  programTitle: string;
  inviteMessage?: string;
  expiresAt: string;
};

export type OnboardSuccess = {
  message: string;
  credentials?: { email: string; password: string };
  redirectTo?: string;
};

export type KycOnboardPayload = {
  fullName: string;
  collegeName: string;
  programName: string;
  phone: string;
  photo: File;
  twelfthCertificate: File;
  aadharFront: File;
  aadharBack: File;
  collegeId: File;
};

export async function fetchInviteByToken(token: string) {
  const { data } = await publicApi.get(`/api/v1/onboard/invite/${token}`);
  return data.invite as InviteDetails;
}

export async function completeOnboarding(token: string, payload: KycOnboardPayload) {
  const formData = new FormData();
  formData.append("fullName", payload.fullName.trim());
  formData.append("collegeName", payload.collegeName.trim());
  formData.append("programName", payload.programName.trim());
  formData.append("phone", payload.phone.trim());
  formData.append("photo", payload.photo);
  formData.append("twelfthCertificate", payload.twelfthCertificate);
  formData.append("aadharFront", payload.aadharFront);
  formData.append("aadharBack", payload.aadharBack);
  formData.append("collegeId", payload.collegeId);

  const { data } = await publicApi.post<OnboardSuccess>(
    `/api/v1/onboard/invite/${token}/complete`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
}

export function getCrmLoginUrl() {
  return (
    process.env.NEXT_PUBLIC_CRM_URL ||
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:3001")
  ).replace(/\/$/, "") + "/signin";
}

export function isGmailAddress(email: string) {
  return /^[a-z0-9.+]+@gmail\.com$/i.test(email.trim());
}
