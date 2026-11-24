"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/features/auth/store/auth.store";
import { decodeJwtPayload } from "@/lib/jwt";
import { ROUTES } from "@/constants/routes";
import DashboardLayout from "@/components/layout/dashboard-layout";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  User,
  Mail,
  Shield,
  Lock,
  LogOut,
  Sun,
  Moon,
  Monitor,
  FileText,
  ChevronLeft,
  Save,
  AlertCircle,
  CheckCircle2,
  Settings,
  Fingerprint,
  Info,
  Sparkles,
} from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const APP_NAME = "Smart Monitoring System";
const APP_VERSION = "0.1.0";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .max(128, "Password is too long"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const cardClass =
  "overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900";

const sectionIconClass =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400";

const fieldClass =
  "flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-3 transition-colors dark:border-slate-700 dark:bg-slate-800/60";

export default function SettingsPage() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);

  const tokenPayload = decodeJwtPayload(token);

  const displayName =
    user?.username ||
    user?.name ||
    user?.full_name ||
    user?.fullName ||
    tokenPayload?.username ||
    "User";

  const displayEmail = user?.email || tokenPayload?.email || "—";

  const displayRole =
    user?.role || user?.user_role || tokenPayload?.role || "—";

  const displayEmployeeId =
    user?.employee_id || user?.employeeId || tokenPayload?.employee_id || "—";

  const initial = displayName.charAt(0).toUpperCase();

  /* ============================================================
     THEME
     ============================================================ */

  const [theme, setThemeState] = useState(() => {
    if (typeof window === "undefined") return "system";

    const stored = localStorage.getItem("theme");

    if (stored) return stored;

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const [systemDark, setSystemDark] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateSystemTheme = () => {
      setSystemDark(mediaQuery.matches);
    };

    updateSystemTheme();

    mediaQuery.addEventListener("change", updateSystemTheme);

    return () => {
      mediaQuery.removeEventListener("change", updateSystemTheme);
    };
  }, []);

  const isDark = theme === "dark" || (theme === "system" && systemDark);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", theme);
  }, [theme, isDark]);

  const handleThemeChange = (value) => {
    setThemeState(value);

    const shouldBeDark =
      value === "dark" || (value === "system" && systemDark);

    document.documentElement.classList.toggle("dark", shouldBeDark);
    localStorage.setItem("theme", value);
  };

  /* ============================================================
     PASSWORD FORM
     ============================================================ */

  const [passwordStatus, setPasswordStatus] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onChangePassword = async (values) => {
    setPasswordStatus(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setPasswordStatus("success");
    } catch {
      setPasswordStatus("error");
    }
  };

  /* ============================================================
     LOGOUT
     ============================================================ */

  const handleLogout = () => {
    logout();
    router.replace(ROUTES.LOGIN);
  };

  /* ============================================================
     THEME OPTIONS
     ============================================================ */

  const themeOptions = [
    {
      value: "light",
      label: "Light",
      description: "Bright appearance",
      icon: Sun,
    },
    {
      value: "dark",
      label: "Dark",
      description: "Easy on the eyes",
      icon: Moon,
    },
    {
      value: "system",
      label: "System",
      description: "Follow device",
      icon: Monitor,
    },
  ];

  /* ============================================================
     REUSABLE CARD HEADER
     ============================================================ */

  const SectionHeader = ({
    icon: Icon,
    title,
    description,
  }) => (
    <CardHeader className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-slate-800">
      <div className="flex min-w-0 items-center gap-3">
        <div className={sectionIconClass}>
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <CardTitle className="text-[15px] font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {title}
          </CardTitle>

          <CardDescription className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            {description}
          </CardDescription>
        </div>
      </div>
    </CardHeader>
  );

  /* ============================================================
     RENDER
     ============================================================ */

  return (
    <DashboardLayout>
      <main className="min-h-screen min-w-0 overflow-x-hidden bg-[#f5f8fc] transition-colors duration-200 dark:bg-slate-950">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

          {/* ====================================================
              PAGE HEADER
          ==================================================== */}

          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                <Settings className="h-6 w-6" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                    Settings
                  </h1>

                  <span className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-500/10 dark:text-blue-300">
                    <Sparkles className="h-3 w-3" />
                    Account
                  </span>
                </div>

                <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  Manage your profile, security preferences, appearance and
                  application information.
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.replace(ROUTES.DASHBOARD)}
              className="h-10 w-full gap-2 rounded-xl border-slate-200 bg-white px-4 text-slate-700 hover:bg-slate-50 sm:w-auto dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>

          {/* ====================================================
              ACCOUNT OVERVIEW
          ==================================================== */}

          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <User className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                  Account
                </p>
                <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {displayName}
                </p>
              </div>
            </div>

            <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                <Shield className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                  Access Role
                </p>
                <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {displayRole}
                </p>
              </div>
            </div>

            <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:col-span-2 lg:col-span-1">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                <Fingerprint className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                  Employee ID
                </p>
                <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {displayEmployeeId}
                </p>
              </div>
            </div>
          </div>

          {/* ====================================================
              PROFILE + PASSWORD
          ==================================================== */}

          <div className="grid min-w-0 gap-6 lg:grid-cols-2">

            {/* PROFILE */}

            <Card className={cardClass}>
              <SectionHeader
                icon={User}
                title="Profile Information"
                description="Your personal account details"
              />

              <CardContent className="space-y-6 p-5 sm:p-6">

                <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-5 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-800/40">
                  <Avatar className="h-20 w-20 shrink-0 border-4 border-white bg-blue-100 shadow-md dark:border-slate-700 dark:bg-blue-900/40">
                    <AvatarFallback className="bg-blue-100 text-2xl font-bold text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                      {initial}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 text-center sm:text-left">
                    <h3 className="break-words text-lg font-bold text-slate-900 dark:text-white">
                      {displayName}
                    </h3>

                    <p className="mt-1 break-all text-sm text-slate-500 dark:text-slate-400">
                      {displayEmail}
                    </p>

                    <span className="mt-3 inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-500/10 dark:text-blue-300">
                      {displayRole}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className={fieldClass}>
                    <Mail className="h-4 w-4 shrink-0 text-slate-400" />

                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Email Address
                      </p>
                      <p className="mt-0.5 break-all text-sm font-medium text-slate-800 dark:text-slate-100">
                        {displayEmail}
                      </p>
                    </div>
                  </div>

                  <div className={fieldClass}>
                    <Shield className="h-4 w-4 shrink-0 text-slate-400" />

                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Account Role
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-slate-800 dark:text-slate-100">
                        {displayRole}
                      </p>
                    </div>
                  </div>

                  <div className={fieldClass}>
                    <FileText className="h-4 w-4 shrink-0 text-slate-400" />

                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Employee ID
                      </p>
                      <p className="mt-0.5 break-all text-sm font-medium text-slate-800 dark:text-slate-100">
                        {displayEmployeeId}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CHANGE PASSWORD */}

            <Card className={cardClass}>
              <SectionHeader
                icon={Lock}
                title="Change Password"
                description="Update your account password"
              />

              <CardContent className="p-5 sm:p-6">
                <form
                  onSubmit={handleSubmit(onChangePassword)}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <Label
                      htmlFor="currentPassword"
                      className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Current Password
                    </Label>

                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="Enter current password"
                      autoComplete="current-password"
                      {...register("currentPassword")}
                      aria-invalid={!!errors.currentPassword}
                      className="h-11 rounded-xl border-slate-200 bg-slate-50/70 text-sm focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-800/60"
                    />

                    {errors.currentPassword && (
                      <p className="text-xs font-medium text-destructive">
                        {errors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="newPassword"
                      className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      New Password
                    </Label>

                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Enter new password"
                      autoComplete="new-password"
                      {...register("newPassword")}
                      aria-invalid={!!errors.newPassword}
                      className="h-11 rounded-xl border-slate-200 bg-slate-50/70 text-sm focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-800/60"
                    />

                    {errors.newPassword && (
                      <p className="text-xs font-medium text-destructive">
                        {errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Confirm New Password
                    </Label>

                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      autoComplete="new-password"
                      {...register("confirmPassword")}
                      aria-invalid={!!errors.confirmPassword}
                      className="h-11 rounded-xl border-slate-200 bg-slate-50/70 text-sm focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-800/60"
                    />

                    {errors.confirmPassword && (
                      <p className="text-xs font-medium text-destructive">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  {passwordStatus === "success" && (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-500/10 dark:text-emerald-300">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      Password changed successfully.
                    </div>
                  )}

                  {passwordStatus === "error" && (
                    <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700 dark:border-red-900/60 dark:bg-red-500/10 dark:text-red-300">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      Failed to change password. Try again.
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 w-full rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* ====================================================
              THEME + ABOUT SYSTEM
          ==================================================== */}

          <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-2">

            {/* THEME */}

            <Card className={cardClass}>
              <SectionHeader
                icon={Monitor}
                title="Appearance"
                description="Customize how the application looks"
              />

              <CardContent className="p-5 sm:p-6">
                <div className="mb-4">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    Choose your theme
                  </p>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Select your preferred display appearance.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {themeOptions.map((option) => {
                    const Icon = option.icon;
                    const active = theme === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleThemeChange(option.value)}
                        aria-pressed={active}
                        className={`group flex min-w-0 items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 sm:flex-col sm:items-center sm:justify-center sm:gap-2 sm:py-5 sm:text-center ${
                          active
                            ? "border-blue-500 bg-blue-50 shadow-sm ring-2 ring-blue-500/10 dark:border-blue-500 dark:bg-blue-500/10"
                            : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-blue-500/60 dark:hover:bg-slate-800"
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                            active
                              ? "bg-blue-600 text-white"
                              : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 dark:bg-slate-700 dark:text-slate-300 dark:group-hover:bg-blue-500/10 dark:group-hover:text-blue-400"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1 sm:flex-none">
                          <p
                            className={`text-sm font-semibold ${
                              active
                                ? "text-blue-700 dark:text-blue-300"
                                : "text-slate-800 dark:text-slate-100"
                            }`}
                          >
                            {option.label}
                          </p>

                          <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                            {option.description}
                          </p>
                        </div>

                        {active && (
                          <CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-blue-600 sm:ml-0 dark:text-blue-400" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50/70 px-3.5 py-3 dark:border-blue-900/50 dark:bg-blue-500/5">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />

                  <p className="text-xs leading-relaxed text-blue-800 dark:text-blue-300">
                    Your appearance preference is saved automatically and
                    remembered across sessions.
                  </p>
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-5 py-3.5 dark:border-slate-800 dark:bg-slate-800/30 sm:px-6">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Current preference
                </span>

                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold capitalize text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {theme}
                </span>
              </CardFooter>
            </Card>

            {/* ABOUT SYSTEM */}

            <Card className={cardClass}>
              <SectionHeader
                icon={FileText}
                title="About System"
                description="Application and version information"
              />

              <CardContent className="space-y-3 p-5 sm:p-6">
                <div className={fieldClass}>
                  <Monitor className="h-4 w-4 shrink-0 text-slate-400" />

                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Application
                    </p>
                    <p className="mt-0.5 break-words text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {APP_NAME}
                    </p>
                  </div>
                </div>

                <div className={fieldClass}>
                  <Info className="h-4 w-4 shrink-0 text-slate-400" />

                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Version
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {APP_VERSION}
                    </p>
                  </div>
                </div>

                <div className={fieldClass}>
                  <Shield className="h-4 w-4 shrink-0 text-slate-400" />

                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Build Environment
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-800 dark:text-slate-100">
                      Production
                    </p>
                  </div>
                </div>

                <Separator className="!my-4 bg-slate-200 dark:bg-slate-700" />

                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                      <Sun className="h-4 w-4" />
                    </div>

                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      Theme Engine
                    </span>
                  </div>

                  <span className="text-right text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Light / Dark / System
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ====================================================
              LOGOUT SECTION
          ==================================================== */}

          <Card className="mt-6 overflow-hidden rounded-2xl border border-red-100 bg-white shadow-sm dark:border-red-900/40 dark:bg-slate-900">
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                  <LogOut className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Sign out of your account
                  </h3>

                  <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    You will need to sign in again to access the application.
                  </p>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleLogout}
                variant="destructive"
                className="h-10 w-full shrink-0 gap-2 rounded-xl px-5 sm:w-auto"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </CardContent>
          </Card>

          {/* FOOTER */}

          <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-slate-200/80 pt-5 text-center sm:flex-row sm:text-left dark:border-slate-800">
            <p className="text-[11px] text-slate-400">
              © {new Date().getFullYear()} Abhijeet Plastics Private Limited
            </p>

            <p className="text-[11px] font-medium text-slate-400">
              {APP_NAME} · v{APP_VERSION}
            </p>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
