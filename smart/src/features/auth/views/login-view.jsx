// "use client";

// import { useState } from "react";

// import {
//   ArrowRight,
//   CheckCircle2,
//   Eye,
//   EyeOff,
//   LockKeyhole,
//   ShieldCheck,
//   UserRound,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// import { useLoginViewModel } from "../view-models/use-login-view-model";

// export default function LoginView() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);

//   const {
//     form,
//     serverError,
//     isLoading,
//     onSubmit,
//   } = useLoginViewModel();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = form;

//   return (
//     <main className="relative min-h-screen overflow-hidden bg-[#08205c]">

//       {/* =====================================================
//           FULLY OPAQUE BLUE BACKGROUND
//       ====================================================== */}

//       <div className="absolute inset-0 bg-gradient-to-br from-[#06194a] via-[#123b9e] to-[#087fca]" />

//       {/* Decorative gradients - no opacity on main background */}

//       <div className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#2859c7] blur-[120px]" />

//       <div className="pointer-events-none absolute -bottom-48 -right-40 h-[620px] w-[620px] rounded-full bg-[#16b7df] blur-[130px]" />

//       <div className="pointer-events-none absolute left-[38%] top-[20%] h-[380px] w-[380px] rounded-full bg-[#314fca] blur-[120px]" />

//       {/* Subtle grid */}

//       <div
//         className="pointer-events-none absolute inset-0"
//         style={{
//           opacity: 0.08,
//           backgroundImage:
//             "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
//           backgroundSize: "45px 45px",
//         }}
//       />

//       {/* Decorative lights */}

//       <div className="pointer-events-none absolute left-[7%] top-[25%] h-3 w-3 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)]" />

//       <div className="pointer-events-none absolute right-[9%] top-[18%] h-4 w-4 rounded-full bg-cyan-200 shadow-[0_0_25px_rgba(165,243,252,0.9)]" />

//       <div className="pointer-events-none absolute bottom-[18%] left-[25%] h-3 w-3 rounded-full bg-blue-200 shadow-[0_0_20px_rgba(191,219,254,0.8)]" />

//       {/* =====================================================
//           PAGE
//       ====================================================== */}

//       <div className="relative z-10 flex min-h-screen items-center justify-center p-0 sm:p-4 lg:p-6">

//         <div className="relative flex min-h-screen w-full max-w-[1500px] overflow-hidden border border-white/20 bg-transparent shadow-[0_35px_100px_rgba(0,0,0,0.3)] sm:min-h-[calc(100vh-32px)] sm:rounded-[30px] lg:min-h-[calc(100vh-48px)]">

//           {/* =================================================
//               DESKTOP TOP LOGO
//               Visible only on desktop
//           ================================================== */}

//           <div
//             className="
//               absolute
//               left-10
//               top-8
//               z-50
//               hidden
//               items-center
//               gap-3
//               lg:flex
//               xl:left-12
//               xl:top-9
//             "
//           >

//             <div className="flex h-[78px] w-[78px] shrink-0 items-center justify-center rounded-[18px] border border-blue-100 bg-white p-1.5 shadow-[0_8px_25px_rgba(0,0,0,0.18)] xl:h-[84px] xl:w-[84px]">

//               <img
//                 src="/logo.png"
//                 alt="ABHIJEET"
//                 className="h-full w-full rounded-[12px] object-contain"
//               />

//             </div>

//             <div>

//               <p className="text-[13px] font-bold uppercase tracking-[0.22em] text-blue-100">
//                 ABHIJEET
//               </p>

//               <p className="mt-0.5 text-[17px] font-semibold text-white">
//                 Smart Monitoring
//               </p>

//               <p className="mt-0.5 text-[11px] text-blue-100/80">
//                 Smart Monitoring System
//               </p>

//             </div>

//           </div>

//           {/* =================================================
//               LEFT DESKTOP SECTION
//           ================================================== */}

//           <section className="relative hidden w-1/2 overflow-hidden lg:block">

//             <div className="pointer-events-none absolute -left-40 top-40 h-[500px] w-[500px] rounded-full bg-cyan-300/10 blur-[120px]" />

//             <div className="pointer-events-none absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-blue-300/10 blur-[110px]" />

//             <div className="relative z-10 flex h-full flex-col justify-center px-12 pb-16 pt-36 xl:px-16">

//               <div className="max-w-xl">

//                 <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
//                   Smart Monitoring System
//                 </p>

//                <h1 className="text-4xl font-bold leading-[1.08] tracking-[-0.025em] text-white xl:text-6xl">

//                   Monitor everything

//                   <span className="mt-2 block bg-gradient-to-r from-cyan-200 via-white to-blue-100 bg-clip-text text-transparent">
//                     in one place.
//                   </span>

//                 </h1>

//                 <p className="mt-6 max-w-lg text-base leading-7 text-blue-100/85 xl:text-lg">
//                   Access your monitoring workspace, manage
//                   operations, and keep your business activities
//                   connected through one secure platform.
//                 </p>

//                 {/* Features */}

//                 <div className="mt-10 space-y-4">

//                   <div className="flex items-center gap-4">

//                     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10">
//                       <CheckCircle2 className="h-5 w-5 text-cyan-200" />
//                     </div>

//                     <div>

//                       <p className="text-sm font-semibold text-white">
//                         Smart monitoring
//                       </p>

//                       <p className="mt-1 text-xs text-blue-100/70">
//                         Keep important activities visible and organized.
//                       </p>

//                     </div>

//                   </div>

//                   <div className="flex items-center gap-4">

//                     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10">
//                       <ShieldCheck className="h-5 w-5 text-cyan-200" />
//                     </div>

//                     <div>

//                       <p className="text-sm font-semibold text-white">
//                         Secure workspace
//                       </p>

//                       <p className="mt-1 text-xs text-blue-100/70">
//                         Your monitoring environment stays protected.
//                       </p>

//                     </div>

//                   </div>

//                 </div>

//               </div>

//               <div className="absolute bottom-7 left-12 text-xs text-blue-100/60 xl:left-16">
//                 © {new Date().getFullYear()} Smart Monitoring System
//               </div>

//             </div>

//           </section>

//           {/* =================================================
//               RIGHT LOGIN SECTION
//           ================================================== */}

//           <section className="relative flex w-full items-center justify-center overflow-hidden bg-transparent px-5 pb-8 pt-8 sm:px-8 lg:w-1/2 lg:px-12 xl:px-20">

//             <div className="relative z-10 w-full max-w-[450px]">

//               {/* =================================================
//                   FORM BRAND LOGO
//                   Visible on mobile + inside form
//               ================================================== */}

//               <div className="mb-6 flex items-center justify-center lg:hidden">

//                 <div className="flex items-center gap-3">

//                   <div className="flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-[17px] border border-blue-100 bg-white p-1.5 shadow-[0_8px_25px_rgba(0,0,0,0.2)]">

//                     <img
//                       src="/logo.png"
//                       alt="ABHIJEET"
//                       className="h-full w-full rounded-[12px] object-contain"
//                     />

//                   </div>

//                   <div>

//                     <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-white">
//                       ABHIJEET
//                     </p>

//                     <p className="mt-0.5 text-[16px] font-semibold text-white">
//                       Smart Monitoring
//                     </p>

//                     <p className="mt-0.5 text-[10px] text-blue-100/75">
//                       Smart Monitoring System
//                     </p>

//                   </div>

//                 </div>

//               </div>

//               {/* =================================================
//                   LOGIN WHITE PANEL
//               ================================================== */}

//               <div className="rounded-[28px] border border-blue-100 bg-[#f8fbff] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.25)] sm:p-7 lg:p-8">

//                 {/* Logo inside form on desktop */}

//                 <div className="mb-7 hidden items-center gap-3 border-b border-blue-100 pb-6 lg:flex">

//                   <div className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-[15px] border border-blue-100 bg-white p-1.5 shadow-sm">

//                     <img
//                       src="/logo.png"
//                       alt="ABHIJEET"
//                       className="h-full w-full rounded-[10px] object-contain"
//                     />

//                   </div>

//                   <div>

//                     <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600">
//                       ABHIJEET
//                     </p>

//                     <p className="text-[15px] font-bold text-slate-800">
//                       Smart Monitoring
//                     </p>

//                     <p className="text-[10px] text-slate-500">
//                       Smart Monitoring System
//                     </p>

//                   </div>

//                 </div>

//                 {/* Heading */}

//                 <div className="mb-7">

//                   <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
//                     Employee Portal
//                   </p>

//                   <h2 className="text-3xl font-bold leading-tight tracking-[-0.025em] text-slate-900 sm:text-[36px]">
//   Welcome back
// </h2>

//                   <p className="mt-3 text-sm leading-6 text-slate-500">
//                     Enter your employee credentials to access
//                     your monitoring workspace.
//                   </p>

//                 </div>

//                 {/* =================================================
//                     FORM
//                 ================================================== */}

//                 <form
//                   onSubmit={handleSubmit(onSubmit)}
//                   className="space-y-5"
//                 >

//                   {/* Employee ID */}

//                   <div className="space-y-2">

//                     <Label
//                       htmlFor="employee_id"
//                       className="text-sm font-semibold text-slate-700"
//                     >
//                       Employee ID
//                     </Label>

//                     <div className="group relative">

//                       <UserRound className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-[18px] w-[18px] -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />

//                       <Input
//                         id="employee_id"
//                         type="text"
//                         placeholder="Enter your employee ID"
//                         autoComplete="username"
//                         aria-invalid={!!errors.employee_id}
//                         className={`h-12 rounded-xl border-slate-200 bg-[#f4f8ff] pl-11 pr-4 text-sm text-slate-800 shadow-none placeholder:text-slate-400 transition-all hover:border-blue-300 focus-visible:border-blue-500 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-blue-100 ${
//                           errors.employee_id
//                             ? "border-red-400 focus-visible:border-red-400"
//                             : ""
//                         }`}
//                         {...register("employee_id")}
//                       />

//                     </div>

//                     {errors.employee_id && (
//                       <p className="text-xs font-medium text-red-500">
//                         {errors.employee_id.message}
//                       </p>
//                     )}

//                   </div>

//                   {/* Password */}

//                   <div className="space-y-2">

//                     <Label
//                       htmlFor="password"
//                       className="text-sm font-semibold text-slate-700"
//                     >
//                       Password
//                     </Label>

//                     <div className="group relative">

//                       <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-[18px] w-[18px] -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />

//                       <Input
//                         id="password"
//                         type={showPassword ? "text" : "password"}
//                         placeholder="Enter your password"
//                         autoComplete="current-password"
//                         aria-invalid={!!errors.password}
//                         className={`h-12 rounded-xl border-slate-200 bg-[#f4f8ff] pl-11 pr-12 text-sm text-slate-800 shadow-none placeholder:text-slate-400 transition-all hover:border-blue-300 focus-visible:border-blue-500 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-blue-100 ${
//                           errors.password
//                             ? "border-red-400 focus-visible:border-red-400"
//                             : ""
//                         }`}
//                         {...register("password")}
//                       />

//                       <button
//                         type="button"
//                         onClick={() => {
//                           setShowPassword((previous) => !previous);
//                         }}
//                         className="absolute right-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-blue-50 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200"
//                         aria-label={
//                           showPassword
//                             ? "Hide password"
//                             : "Show password"
//                         }
//                       >
//                         {showPassword ? (
//                           <EyeOff className="h-5 w-5" />
//                         ) : (
//                           <Eye className="h-5 w-5" />
//                         )}
//                       </button>

//                     </div>

//                     {errors.password && (
//                       <p className="text-xs font-medium text-red-500">
//                         {errors.password.message}
//                       </p>
//                     )}

//                   </div>

//                   {/* Remember / Forgot */}

//                   <div className="flex items-center justify-between pt-1">

//                     <label className="flex cursor-pointer items-center gap-2">

//                       <input
//                         type="checkbox"
//                         checked={rememberMe}
//                         onChange={(event) =>
//                           setRememberMe(event.target.checked)
//                         }
//                         className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-blue-600 focus:ring-blue-200"
//                       />

//                       <span className="text-sm text-slate-600">
//                         Remember me
//                       </span>

//                     </label>

//                     <button
//                       type="button"
//                       className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
//                     >
//                       Forgot password?
//                     </button>

//                   </div>

//                   {/* API Error */}

//                   {serverError && (
//                     <div
//                       role="alert"
//                       className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-5 text-red-600"
//                     >
//                       {serverError}
//                     </div>
//                   )}

//                   {/* =================================================
//                       BLUE BUTTON
//                   ================================================== */}

//                   <Button
//                     type="submit"
//                     disabled={isLoading}
//                     className="group h-12 w-full rounded-xl border-0 bg-gradient-to-r from-[#2563eb] via-[#2878f0] to-[#0891d1] text-sm font-semibold text-white shadow-[0_10px_25px_rgba(37,99,235,0.28)] transition-all duration-200 hover:scale-[1.01] hover:from-[#1d4ed8] hover:via-[#2563eb] hover:to-[#0284c7] hover:shadow-[0_14px_30px_rgba(37,99,235,0.35)] focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
//                   >

//                     {isLoading ? (
//                       <span className="flex items-center justify-center gap-2">

//                         <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />

//                         Signing in...

//                       </span>
//                     ) : (
//                       <span className="flex items-center justify-center gap-2">

//                         Sign in to workspace

//                         <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />

//                       </span>
//                     )}

//                   </Button>

//                 </form>

//                 {/* Security */}

//                 <div className="mt-6 flex items-center justify-center gap-2 border-t border-blue-100 pt-5 text-xs text-slate-400">

//                   <ShieldCheck className="h-4 w-4 text-blue-500" />

//                   <span>
//                     Secure Smart Monitoring System
//                   </span>

//                 </div>

//               </div>

//               {/* Mobile copyright */}

//               <p className="mt-5 text-center text-[11px] text-blue-100/65 lg:hidden">
//                 © {new Date().getFullYear()} Smart Monitoring System
//               </p>

//             </div>

//           </section>

//         </div>

//       </div>

//     </main>
//   );
// }




"use client";

import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useLoginViewModel } from "../view-models/use-login-view-model";

export default function LoginView() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    form,
    serverError,
    isLoading,
    onSubmit,
  } = useLoginViewModel();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#06194a] font-sans">

      <div className="absolute inset-0 bg-gradient-to-br from-[#06194a] via-[#173da3] to-[#08a4d4]" />

      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#315dcc] blur-[120px]" />

      <div className="pointer-events-none absolute -bottom-48 -right-40 h-[600px] w-[600px] rounded-full bg-[#18b9df] blur-[130px]" />

      <div className="pointer-events-none absolute left-[35%] top-[20%] h-[400px] w-[400px] rounded-full bg-[#3d50d0] blur-[130px]" />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0.08,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
          backgroundSize: "45px 45px",
        }}
      />

      <div className="pointer-events-none absolute left-[7%] top-[25%] h-3 w-3 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,.9)]" />

      <div className="pointer-events-none absolute right-[9%] top-[18%] h-4 w-4 rounded-full bg-cyan-200 shadow-[0_0_25px_rgba(165,243,252,.95)]" />

      <div className="pointer-events-none absolute bottom-[18%] left-[25%] h-3 w-3 rounded-full bg-blue-200 shadow-[0_0_20px_rgba(191,219,254,.9)]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-0 sm:p-4 lg:p-6">

        <div className="relative flex min-h-screen w-full max-w-[1500px] overflow-hidden border border-white/20 shadow-[0_35px_100px_rgba(0,0,0,.3)] sm:min-h-[calc(100vh-32px)] sm:rounded-[30px] lg:min-h-[calc(100vh-48px)]">

          {/* Desktop branding */}

          <div className="absolute left-8 top-7 z-50 hidden items-center gap-3 lg:flex xl:left-12 xl:top-9">

            <div className="flex h-[80px] w-[80px] shrink-0 items-center justify-center rounded-[18px] border border-blue-100 bg-white p-1.5 shadow-lg xl:h-[86px] xl:w-[86px]">
              <img
                src="/logo.png"
                alt="ABHIJEET"
                className="h-full w-full rounded-[12px] object-contain"
              />
            </div>

            <div>
              <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-blue-100">
                ABHIJEET
              </p>

              <p className="mt-1 text-[18px] font-semibold text-white">
                Smart Monitoring
              </p>

              <p className="mt-1 text-[12px] font-medium text-blue-100/85">
                Smart Monitoring System
              </p>
            </div>

          </div>

          {/* Desktop left content */}

          <section className="relative hidden w-1/2 lg:block">

            <div className="relative flex h-full flex-col justify-center px-12 pb-16 pt-36 xl:px-16">

              <div className="max-w-xl">

                <p className="mb-5 text-[13px] font-semibold uppercase tracking-[0.2em] text-cyan-200">
                  Smart Monitoring System
                </p>

                <h1 className="text-5xl font-bold leading-[1.08] tracking-[-0.035em] text-white xl:text-[58px]">
                  Monitor everything

                  <span className="mt-2 block bg-gradient-to-r from-cyan-200 via-white to-blue-100 bg-clip-text text-transparent">
                    in one place.
                  </span>
                </h1>

                <p className="mt-6 max-w-lg text-[16px] leading-7 text-blue-100/90 xl:text-[17px]">
                  Access your monitoring workspace, manage
                  operations, and keep your business activities
                  connected through one secure platform.
                </p>

                <div className="mt-10 space-y-6">

                  <div className="flex items-center gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10">
                      <CheckCircle2 className="h-5 w-5 text-cyan-200" />
                    </div>

                    <div>
                      <p className="text-[15px] font-semibold text-white">
                        Smart monitoring
                      </p>

                      <p className="mt-1 text-[13px] leading-5 text-blue-100/80">
                        Keep important activities visible and organized.
                      </p>
                    </div>

                  </div>

                  <div className="flex items-center gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10">
                      <ShieldCheck className="h-5 w-5 text-cyan-200" />
                    </div>

                    <div>
                      <p className="text-[15px] font-semibold text-white">
                        Secure workspace
                      </p>

                      <p className="mt-1 text-[13px] leading-5 text-blue-100/80">
                        Your monitoring environment stays protected.
                      </p>
                    </div>

                  </div>

                </div>

              </div>

              <p className="absolute bottom-7 left-12 text-[13px] font-medium text-blue-100/70 xl:left-16">
                © {new Date().getFullYear()} Smart Monitoring System
              </p>

            </div>

          </section>

          {/* Login section */}

          <section className="relative flex w-full items-center justify-center px-4 py-8 sm:px-8 lg:w-1/2 lg:px-12 xl:px-20">

            <div className="w-full max-w-[460px]">

              <div className="rounded-[26px] border border-blue-100 bg-[#f9fbff] p-5 shadow-[0_30px_80px_rgba(0,0,0,.25)] sm:p-7 lg:p-8">

                {/* Form logo */}

                <div className="mb-7 flex items-center gap-3 border-b border-blue-100 pb-6">

                  <div className="flex h-[64px] w-[64px] shrink-0 items-center justify-center rounded-[16px] border border-blue-100 bg-white p-1.5 shadow-sm sm:h-[68px] sm:w-[68px]">

                    <img
                      src="/logo.png"
                      alt="ABHIJEET"
                      className="h-full w-full rounded-[11px] object-contain"
                    />

                  </div>

                  <div>

                    <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-blue-600">
                      ABHIJEET
                    </p>

                    <p className="mt-1 text-[17px] font-bold text-slate-800">
                      Smart Monitoring
                    </p>

                    <p className="mt-1 text-[12px] font-medium text-slate-500">
                      Smart Monitoring System
                    </p>

                  </div>

                </div>

                {/* Heading */}

                <div className="mb-8">

                  <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.18em] text-blue-600">
                    Employee Portal
                  </p>

                  <h2 className="text-[32px] font-bold leading-tight tracking-[-0.03em] text-slate-900 sm:text-[38px]">
                    Welcome back
                  </h2>

                  <p className="mt-3 text-[15px] leading-6 text-slate-600">
                    Enter your employee credentials to access
                    your monitoring workspace.
                  </p>

                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                >

                  {/* Employee ID */}

                  <div className="space-y-2.5">

                    <Label
                      htmlFor="employee_id"
                      className="text-[15px] font-semibold text-slate-700"
                    >
                      Employee ID
                    </Label>

                    <div className="group relative">

                      <UserRound className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500" />

                      <Input
                        id="employee_id"
                        type="text"
                        placeholder="Enter your employee ID"
                        autoComplete="username"
                        aria-invalid={!!errors.employee_id}
                        className={`h-[54px] rounded-xl border-slate-200 bg-[#f3f7fd] pl-12 pr-4 text-[15px] font-medium text-slate-800 shadow-none placeholder:text-[15px] placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-blue-100 ${
                          errors.employee_id
                            ? "border-red-400"
                            : ""
                        }`}
                        {...register("employee_id")}
                      />

                    </div>

                    {errors.employee_id && (
                      <p className="text-[13px] font-medium text-red-500">
                        {errors.employee_id.message}
                      </p>
                    )}

                  </div>

                  {/* Password */}

                  <div className="space-y-2.5">

                    <Label
                      htmlFor="password"
                      className="text-[15px] font-semibold text-slate-700"
                    >
                      Password
                    </Label>

                    <div className="group relative">

                      <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500" />

                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        aria-invalid={!!errors.password}
                        className={`h-[54px] rounded-xl border-slate-200 bg-[#f3f7fd] pl-12 pr-12 text-[15px] font-medium text-slate-800 shadow-none placeholder:text-[15px] placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-blue-100 ${
                          errors.password
                            ? "border-red-400"
                            : ""
                        }`}
                        {...register("password")}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((previous) => !previous)
                        }
                        className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>

                    </div>

                    {errors.password && (
                      <p className="text-[13px] font-medium text-red-500">
                        {errors.password.message}
                      </p>
                    )}

                  </div>

                  {/* Options */}

                  <div className="flex items-center justify-between gap-3">

                    <label className="flex cursor-pointer items-center gap-2.5">

                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(event) =>
                          setRememberMe(event.target.checked)
                        }
                        className="h-4 w-4 cursor-pointer accent-blue-600"
                      />

                      <span className="text-[14px] font-medium text-slate-600">
                        Remember me
                      </span>

                    </label>

                    <button
                      type="button"
                      className="text-[14px] font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Forgot password?
                    </button>

                  </div>

                  {/* API error */}

                  {serverError && (
                    <div
                      role="alert"
                      className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-[14px] leading-5 text-red-600"
                    >
                      {serverError}
                    </div>
                  )}

                  {/* Submit */}

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-[54px] w-full rounded-xl bg-gradient-to-r from-[#2563eb] via-[#2878f0] to-[#0891d1] text-[15px] font-semibold text-white shadow-[0_10px_25px_rgba(37,99,235,.28)] hover:from-[#1d4ed8] hover:via-[#2563eb] hover:to-[#0284c7]"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Signing in...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Sign in to workspace
                        <ArrowRight className="h-5 w-5" />
                      </span>
                    )}
                  </Button>

                </form>

                {/* Security */}

                <div className="mt-6 flex items-center justify-center gap-2 border-t border-blue-100 pt-5 text-[13px] font-medium text-slate-500">

                  <ShieldCheck className="h-4 w-4 shrink-0 text-blue-500" />

                  <span>
                    Secure Smart Monitoring System
                  </span>

                </div>

              </div>

              <p className="mt-5 text-center text-[12px] font-medium text-blue-100/75 lg:hidden">
                © {new Date().getFullYear()} Smart Monitoring System
              </p>

            </div>

          </section>

        </div>

      </div>

    </main>
  );
}