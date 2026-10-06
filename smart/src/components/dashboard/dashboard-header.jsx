"use client";

import { useState } from "react";
import {
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from "lucide-react";

export default function DashboardHeader() {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="mb-8 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-blue-600">
          Smart Monitoring System
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          Welcome back. Here's what's happening today.
        </p>
      </div>

      <div className="relative flex shrink-0 items-center gap-2">
        {/* Notification */}
        <button
          type="button"
          className="
            relative flex h-10 w-10 items-center justify-center
            rounded-xl border border-slate-200
            bg-white text-slate-600 shadow-sm
            transition hover:bg-slate-50 hover:text-slate-900
          "
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* Profile */}
        <button
          type="button"
          onClick={() => setProfileOpen((value) => !value)}
          className="
            hidden items-center gap-3 rounded-xl border
            border-slate-200 bg-white px-3 py-2
            shadow-sm transition hover:bg-slate-50
            sm:flex
          "
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-700">
            A
          </div>

          <div className="text-left">
            <p className="text-xs font-semibold text-slate-800">
              Administrator
            </p>

            <p className="text-[10px] text-slate-400">
              Admin
            </p>
          </div>

          <ChevronDown className="h-4 w-4 text-slate-400" />
        </button>

        {profileOpen && (
          <div className="absolute right-0 top-12 z-30 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
            >
              <User className="h-4 w-4" />
              Profile
            </button>

            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>

            <div className="my-1 h-px bg-slate-100" />

            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}