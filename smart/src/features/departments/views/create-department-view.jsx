
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  LoaderCircle,
  Plus,
  RotateCcw,
  XCircle,
} from "lucide-react";

import { departmentService } from "@/features/departments/services/department.services";

export default function CreateDepartmentView() {
  const router = useRouter();

  const [department, setDepartment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const departmentName = department.trim();

    if (!departmentName) {
      setError("Please enter a department name.");
      return;
    }

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token")
        : null;

    if (!token) {
      setError("Your session has expired. Please log in again.");
      return;
    }

    try {
      setIsLoading(true);

      const response =
        await departmentService.createDepartment(departmentName);

      setSuccess(
        response?.message || "Department created successfully."
      );

      setDepartment("");
    } catch (err) {
      const status = err?.response?.status;

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        err?.message;

      if (status === 401 || status === 403) {
        setError(
          message ||
            "You are not authorized to create a department."
        );
      } else if (status === 409) {
        setError(message || "This department already exists.");
      } else {
        setError(
          message || "Unable to create the department. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f8fd] p-4 pt-20 sm:p-6 lg:p-8 lg:pt-8">
      <div className="mx-auto max-w-5xl">
        {/* Breadcrumb */}
        <Link
          href="/departments"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Departments
        </Link>

        {/* Page heading */}
        <div className="mb-8">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
            <Building2 className="h-7 w-7" />
          </div>

          <p className="text-sm font-semibold text-blue-600">
            Smart Monitoring System
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Create Department
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Add a new department to your organization and manage
            your monitoring structure.
          </p>
        </div>

        {/* Form card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Building2 className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Department Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter the information below to create a department.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-5 sm:p-8">
            {/* Department name */}
            <div>
              <label
                htmlFor="department"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Department Name
                <span className="ml-1 text-red-500">*</span>
              </label>

              <input
                id="department"
                name="department"
                type="text"
                value={department}
                onChange={(event) => {
                  setDepartment(event.target.value);
                  setError("");
                  setSuccess("");
                }}
                placeholder="e.g. Assembly, Production, Quality"
                maxLength={100}
                autoComplete="off"
                disabled={isLoading}
                required
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50"
              />

              <p className="mt-2 text-xs text-slate-400">
                Enter a clear, unique department name.
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div
                role="alert"
                className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Success message */}
            {success && (
              <div
                role="status"
                className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="font-semibold">{success}</p>
                  <p className="mt-1 text-xs text-emerald-600">
                    Your department request completed successfully.
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => {
                  setDepartment("");
                  setError("");
                  setSuccess("");
                }}
                disabled={isLoading}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-700 hover:to-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Create Department
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Information card */}
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-5">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Access and security
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              Department creation requires a valid authentication
              token and the appropriate backend permissions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
