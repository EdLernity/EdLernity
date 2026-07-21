"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [tokenHandoff, setTokenHandoff] = useState(false);
  const { login, loginWithToken } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const resolveRedirect = (result: { role?: string; redirectTo?: string }) => {
    const defaultRedirect =
      result.role === "intern"
        ? "/my-profile"
        : result.role === "trainer"
          ? "/trainer"
          : result.role === "manager"
            ? "/"
            : "/";
    return result.redirectTo || searchParams.get("redirect") || defaultRedirect;
  };

  // SSO handoff from main site (www.edlernity.com/auth/login → portal with ?token=)
  useEffect(() => {
    const token = searchParams.get("token");
    if (!token || tokenHandoff) return;

    let cancelled = false;
    setTokenHandoff(true);
    setSubmitting(true);
    setError("");

    loginWithToken(token)
      .then((result) => {
        if (cancelled) return;
        if (!result.ok) {
          setError(result.message || "Session handoff failed. Please sign in.");
          // Drop token from URL so refresh doesn't loop
          router.replace("/signin");
          return;
        }
        router.replace(resolveRedirect(result));
      })
      .catch(() => {
        if (!cancelled) {
          setError("Session handoff failed. Please sign in.");
          router.replace("/signin");
        }
      })
      .finally(() => {
        if (!cancelled) setSubmitting(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const result = await login(email.trim(), password);
      if (!result.ok) {
        setError(result.message || "Login failed");
        return;
      }
      router.replace(resolveRedirect(result));
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (tokenHandoff && submitting) {
    return (
      <div className="flex flex-col flex-1 lg:w-1/2 w-full">
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto p-8 text-center">
          <p className="text-sm text-gray-500">Signing you into the portal…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              EdLernity CRM
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Staff, trainers, and career interns sign in here.
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {error && (
                <p className="text-sm text-error-500 bg-error-50 dark:bg-error-500/10 rounded-lg px-4 py-3">
                  {error}
                </p>
              )}
              <div>
                <Label>
                  Email <span className="text-error-500">*</span>
                </Label>
                <Input
                  placeholder="admin@edlernity.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                </div>
              </div>
              <div>
                <Button className="w-full" size="sm" disabled={submitting}>
                  {submitting ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
