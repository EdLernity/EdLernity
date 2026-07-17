"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { clearToken, getToken, setToken } from "@/lib/authStorage";
import { fetchUserDetails, fetchMyKycStatus, login as apiLogin, UserProfile, UserRole } from "@/lib/crmApi";

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isManager: boolean;
  isStaff: boolean;
  isIntern: boolean;
  isTrainer: boolean;
  role: UserRole | string;
  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string; role?: string; redirectTo?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STAFF_ROLES = new Set(["admin", "manager"]);
const INTERN_ROLE = "intern";
const TRAINER_ROLE = "trainer";
const INTERN_PATHS = ["/my-profile", "/my-offer-letters", "/my-certificates", "/resubmit-kyc"];
const INTERN_HOME = "/my-profile";
const ADMIN_ONLY_PREFIXES = [
  "/users",
  "/operations",
  "/transactions",
  "/certificates",
  "/offer-letters",
  "/careers-programs",
  "/trainer-assignments",
];
const MANAGER_HOME = "/";
const TRAINER_HOME = "/trainer";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const role =
    user?.role === "intern"
      ? "intern"
      : user?.effectiveRole || user?.role || "student";
  const isAdmin = role === "admin";
  const isManager = role === "manager";
  const isStaff = STAFF_ROLES.has(role);
  const isIntern = role === INTERN_ROLE;
  const isTrainer = role === TRAINER_ROLE;

  const refreshUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const profile = await fetchUserDetails();
      setUser(profile);
    } catch {
      clearToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    if (loading) return;
    const isAuthPage = pathname === "/signin" || pathname === "/unauthorized";
    if (!getToken() && !isAuthPage && !pathname.startsWith("/intern-onboard")) {
      router.replace("/signin");
      return;
    }
    if (!user || isAuthPage) return;

    if (isIntern) {
      let cancelled = false;
      fetchMyKycStatus()
        .then((kyc) => {
          if (cancelled) return;
          if (kyc?.approvalStatus === "rejected") {
            if (!pathname.startsWith("/resubmit-kyc")) {
              router.replace("/resubmit-kyc");
            }
            return;
          }
          if (pathname.startsWith("/resubmit-kyc")) {
            router.replace(INTERN_HOME);
            return;
          }
          const onInternPage = INTERN_PATHS.some((path) => pathname.startsWith(path));
          const onStaffPage =
            pathname === "/" ||
            [...ADMIN_ONLY_PREFIXES, "/interns", "/invites", "/trainer"].some((prefix) =>
              pathname.startsWith(prefix)
            );
          if (onStaffPage || !onInternPage) {
            router.replace(INTERN_HOME);
          }
        })
        .catch(() => {
          if (cancelled) return;
          const onInternPage = INTERN_PATHS.some((path) => pathname.startsWith(path));
          if (!onInternPage) router.replace(INTERN_HOME);
        });
      return () => {
        cancelled = true;
      };
    }

    if (isTrainer) {
      const onTrainerPage =
        pathname === "/trainer" || pathname.startsWith("/trainer/");
      if (!onTrainerPage) {
        router.replace(TRAINER_HOME);
      }
      return;
    }

    if (!isStaff) {
      router.replace("/unauthorized");
      return;
    }

    if (isManager) {
      const onAdminPage =
        ADMIN_ONLY_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
        pathname.startsWith("/trainer");
      if (onAdminPage) {
        router.replace(MANAGER_HOME);
      }
    }
  }, [loading, user, isStaff, isIntern, isTrainer, isManager, pathname, router]);

  const login = async (email: string, password: string) => {
    const result = await apiLogin(email, password);
    if (!result.success || !result.token) {
      return { ok: false, message: result.message || "Login failed" };
    }
    setToken(result.token);
    try {
      const profile = await fetchUserDetails();
      const effective =
        profile.role === "intern" ? "intern" : profile.effectiveRole || profile.role;
      if (!STAFF_ROLES.has(effective) && effective !== INTERN_ROLE && effective !== TRAINER_ROLE) {
        clearToken();
        setUser(null);
        return { ok: false, message: "This portal is for staff, trainers, and career interns only." };
      }
      setUser(profile);
      if (effective === INTERN_ROLE) {
        try {
          const kyc = await fetchMyKycStatus();
          if (kyc?.approvalStatus === "rejected") {
            return { ok: true, role: effective, redirectTo: "/resubmit-kyc" };
          }
        } catch {
          // ignore KYC fetch errors; intern can still access portal
        }
      }
      const redirectTo =
        effective === INTERN_ROLE
          ? undefined
          : effective === TRAINER_ROLE
            ? TRAINER_HOME
            : effective === "manager"
              ? MANAGER_HOME
              : undefined;
      return {
        ok: true,
        role: effective,
        redirectTo,
      };
    } catch {
      clearToken();
      return { ok: false, message: "Failed to load user profile" };
    }
  };

  const logout = () => {
    clearToken();
    setUser(null);
    router.replace("/signin");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, isAdmin, isManager, isStaff, isIntern, isTrainer, role, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
