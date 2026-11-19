
"use client";

import { forwardRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronDown,
  Copy,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  RefreshCw,
  ShieldCheck,
  User,
  UserPlus,
  X,
} from "lucide-react";

import { useCreateEmployeeViewModel } from "../view-models/use-create-employee-view-model";

/* -------------------------------------------------------------------------- */
/* Theme                                                                      */
/* -------------------------------------------------------------------------- */

const BRAND_BLUE = "text-[#3b4fe0]";

/* -------------------------------------------------------------------------- */
/* Reusable Components                                                        */
/* -------------------------------------------------------------------------- */

function inputClasses(invalid, hasRight) {
  return `h-[52px] w-full rounded-xl border bg-slate-50 pl-11 ${
    hasRight ? "pr-12" : "pr-4"
  } text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
    invalid
      ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
      : "border-slate-200 focus:border-[#3b4fe0] focus:ring-[#3b4fe0]/15"
  }`;
}

function Field({ label, htmlFor, error, children }) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-semibold text-slate-800"
      >
        {label}
      </label>

      {children}

      {error && (
        <p className="mt-1.5 text-xs font-medium text-rose-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const IconInput = forwardRef(function IconInput(
  { icon: Icon, invalid, right, ...props },
  ref
) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />

      <input
        ref={ref}
        {...props}
        className={inputClasses(invalid, Boolean(right))}
      />

      {right && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {right}
        </div>
      )}
    </div>
  );
});

const IconSelect = forwardRef(function IconSelect(
  { icon: Icon, invalid, placeholder, options, ...props },
  ref
) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />

      <select
        ref={ref}
        defaultValue=""
        {...props}
        className={`${inputClasses(invalid, true)} appearance-none`}
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
});

/* -------------------------------------------------------------------------- */
/* Copy Helper                                                                */
/* -------------------------------------------------------------------------- */

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const area = document.createElement("textarea");

      area.value = text;
      area.style.position = "fixed";
      area.style.opacity = "0";

      document.body.appendChild(area);
      area.select();

      const ok = document.execCommand("copy");

      document.body.removeChild(area);

      return ok;
    } catch {
      return false;
    }
  }
}

/* -------------------------------------------------------------------------- */
/* Brand                                                                      */
/* -------------------------------------------------------------------------- */

function Brand() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-2xl border border-slate-100 bg-white p-1.5 shadow-sm">
        <img
          src="/logo.png"
          alt="ABHIJEET"
          className="h-full w-full rounded-xl object-contain"
        />
      </div>

      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#3b4fe0]">
          ABHIJEET
        </p>

        <p className="text-lg font-bold leading-tight text-slate-900">
          Smart Monitoring
        </p>

        <p className="text-xs text-slate-500">
          Smart Monitoring System
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main View                                                                  */
/* -------------------------------------------------------------------------- */

export default function CreateEmployeeView() {
  const {
    form,
    onSubmit,
    departments,
    roles,
    isLoadingLists,
    isSaving,
    serverError,
    createdEmployee,
    dismissCreated,
  } = useCreateEmployeeViewModel();

  const {
    register,
    formState: { errors },
  } = form;

  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState("");

  const handleCopy = async (text, key) => {
    if (!text) return;

    const ok = await copyText(text);

    if (ok) {
      setCopied(key);
      setTimeout(() => setCopied(""), 1500);
    }
  };

  return (
    /* Plain transparent page - no background */

    <div className="flex min-h-[calc(100vh-48px)] w-full items-center justify-center bg-transparent px-3 py-6 sm:px-6 lg:px-8">

      {/* Centered Registration Card */}

      <div className="mx-auto w-full max-w-[900px] rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-[0_8px_35px_rgba(15,23,42,0.07)] sm:p-9 lg:p-10">

        {/* Brand */}

        <Brand />

        <div className="my-6 h-px bg-slate-100" />

        {/* Heading */}

        <div>
          <p
            className={`text-[11px] font-bold uppercase tracking-[0.28em] ${BRAND_BLUE}`}
          >
            Admin Console
          </p>

          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Add new person
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Fill in the details below. The person can sign in with their
            Employee ID and the password you set.
          </p>
        </div>

        {/* Success Message */}

        {createdEmployee && (
          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-start gap-3">

              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-emerald-900">
                  {createdEmployee.full_name} was registered
                </p>

                <p className="mt-0.5 text-xs text-emerald-800">
                  Employee ID:{" "}
                  <span className="font-semibold">
                    {createdEmployee.employee_id}
                  </span>
                </p>

                <div className="mt-3 flex items-center justify-between gap-2 rounded-lg bg-white px-3 py-2">
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-slate-500">
                      Temporary password (shown only once)
                    </p>

                    <p className="truncate font-mono text-sm font-semibold text-slate-900">
                      {createdEmployee.tempPassword}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(createdEmployee.tempPassword, "temp")
                    }
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    {copied === "temp" ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={dismissCreated}
                aria-label="Dismiss"
                className="rounded-lg p-1 text-emerald-700 transition hover:bg-emerald-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Server Error */}

        {serverError && (
          <div
            className="mt-5 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"
            role="alert"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Registration Form */}

        <form onSubmit={onSubmit} noValidate className="mt-7">

          <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">

            {/* Full Name */}

            <Field
              label="Full name"
              htmlFor="fullName"
              error={errors.fullName?.message}
            >
              <IconInput
                id="fullName"
                icon={User}
                placeholder="Enter the full name"
                autoComplete="off"
                invalid={Boolean(errors.fullName)}
                {...register("fullName")}
              />
            </Field>

            {/* Employee ID */}

            <Field
              label="Employee ID"
              htmlFor="employeeId"
              error={errors.employeeId?.message}
            >
              <IconInput
                id="employeeId"
                icon={BadgeCheck}
                placeholder="name@company"
                autoComplete="off"
                invalid={Boolean(errors.employeeId)}
                {...register("employeeId")}
              />
            </Field>

            {/* Mobile Number */}

            <Field
              label="Mobile number"
              htmlFor="phone"
              error={errors.phone?.message}
            >
              <IconInput
                id="phone"
                icon={Phone}
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="10-digit mobile number"
                autoComplete="off"
                invalid={Boolean(errors.phone)}
                {...register("phone")}
              />
            </Field>

            {/* Email */}

            <Field
              label="Email address"
              htmlFor="email"
              error={errors.email?.message}
            >
              <IconInput
                id="email"
                icon={Mail}
                type="email"
                placeholder="name@example.com"
                autoComplete="off"
                invalid={Boolean(errors.email)}
                {...register("email")}
              />
            </Field>

            {/* Department */}

            <Field
              label="Department"
              htmlFor="departmentId"
              error={errors.departmentId?.message}
            >
              <IconSelect
                id="departmentId"
                icon={Building2}
                placeholder={
                  isLoadingLists ? "Loading..." : "Select department"
                }
                options={departments}
                invalid={Boolean(errors.departmentId)}
                {...register("departmentId")}
              />
            </Field>

            {/* Role */}

            <Field
              label="Role"
              htmlFor="roleId"
              error={errors.roleId?.message}
            >
              <IconSelect
                id="roleId"
                icon={Briefcase}
                placeholder={isLoadingLists ? "Loading..." : "Select role"}
                options={roles}
                invalid={Boolean(errors.roleId)}
                {...register("roleId")}
              />
            </Field>

            {/* Password */}

            <Field
              label="Password"
              htmlFor="password"
              error={errors.password?.message}
            >
              <IconInput
                id="password"
                icon={Lock}
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                autoComplete="new-password"
                invalid={Boolean(errors.password)}
                right={
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="rounded-md p-1 text-slate-400 transition hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-[18px] w-[18px]" />
                    ) : (
                      <Eye className="h-[18px] w-[18px]" />
                    )}
                  </button>
                }
                {...register("password")}
              />
            </Field>

            {/* Confirm Password */}

            <Field
              label="Confirm password"
              htmlFor="confirmPassword"
              error={errors.confirmPassword?.message}
            >
              <IconInput
                id="confirmPassword"
                icon={Lock}
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter the password"
                autoComplete="new-password"
                invalid={Boolean(errors.confirmPassword)}
                {...register("confirmPassword")}
              />
            </Field>

          </div>

          {/* Submit Button */}

          <button
            type="submit"
            disabled={isSaving}
            className="mt-8 flex h-[56px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#3453e0] to-[#1f84d6] text-[15px] font-bold text-white shadow-lg shadow-blue-600/20 transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSaving ? (
              <>
                <RefreshCw className="h-[18px] w-[18px] animate-spin" />
                Registering...
              </>
            ) : (
              <>
                <UserPlus className="h-[18px] w-[18px]" />
                Register person
                <ArrowRight className="h-[18px] w-[18px]" />
              </>
            )}
          </button>

        </form>

        {/* Footer */}

        <div className="mt-6 border-t border-slate-100 pt-5">
          <p className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5 text-[#3b4fe0]" />
            Secure Smart Monitoring System
          </p>
        </div>

      </div>
    </div>
  );
}