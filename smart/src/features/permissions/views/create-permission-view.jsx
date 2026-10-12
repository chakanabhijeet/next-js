// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";

// import {
//   AlertCircle,
//   ArrowLeft,
//   Building2,
//   CheckCircle2,
//   KeyRound,
//   Loader2,
//   Save,
//   ShieldCheck,
//   UserRound,
//   UsersRound,
// } from "lucide-react";

// import { permissionService } from "../services/permission.service";

// /*
// |--------------------------------------------------------------------------
// | Dummy Target Users
// |--------------------------------------------------------------------------
// | These are the users who can receive permissions.
// |
// | Later this will come from the Users API.
// |--------------------------------------------------------------------------
// */
// const users = [
//   {
//     id: 1,
//     name: "Administrator",
//     employee_id: "EMP001",
//   },
//   {
//     id: 2,
//     name: "Plant Head",
//     employee_id: "EMP002",
//   },
//   {
//     id: 3,
//     name: "Production Manager",
//     employee_id: "EMP003",
//   },
//   {
//     id: 4,
//     name: "Quality Manager",
//     employee_id: "EMP004",
//   },
// ];

// /*
// |--------------------------------------------------------------------------
// | Dummy Roles
// |--------------------------------------------------------------------------
// | Temporary data.
// |--------------------------------------------------------------------------
// */
// const roles = [
//   {
//     id: 1,
//     name: "Super Admin",
//   },
//   {
//     id: 2,
//     name: "Tenant Admin",
//   },
// ];

// /*
// |--------------------------------------------------------------------------
// | Dummy Departments
// |--------------------------------------------------------------------------
// | Temporary data.
// |
// | Later:
// | GET Departments API
// |        ↓
// | departments state
// |        ↓
// | Department dropdown
// |--------------------------------------------------------------------------
// */
// const departments = [
//   {
//     id: 1,
//     name: "Assembly",
//   },
//   {
//     id: 2,
//     name: "Production",
//   },
//   {
//     id: 3,
//     name: "Quality",
//   },
//   {
//     id: 4,
//     name: "Maintenance",
//   },
//   {
//     id: 5,
//     name: "Stores",
//   },
// ];

// export default function CreatePermissionView() {
//   /*
//   |--------------------------------------------------------------------------
//   | Logged-in User
//   |--------------------------------------------------------------------------
//   */

//   const [loggedInUser, setLoggedInUser] = useState(null);

//   /*
//   |--------------------------------------------------------------------------
//   | Form
//   |--------------------------------------------------------------------------
//   */

//   const [userId, setUserId] = useState("");
//   const [roleId, setRoleId] = useState("");
//   const [deptId, setDeptId] = useState("");

//   /*
//   |--------------------------------------------------------------------------
//   | Permissions
//   |--------------------------------------------------------------------------
//   */

//   const [permissions, setPermissions] = useState({
//     all_perm: false,
//     create_perm: false,
//     read_perm: false,
//     update_perm: false,
//     temp_update_permission: false,
//     delete_perm: false,
//   });

//   /*
//   |--------------------------------------------------------------------------
//   | UI
//   |--------------------------------------------------------------------------
//   */

//   const [loading, setLoading] = useState(false);

//   const [message, setMessage] = useState({
//     type: "",
//     text: "",
//   });

//   /*
//   |--------------------------------------------------------------------------
//   | Load Logged-in User
//   |--------------------------------------------------------------------------
//   |
//   | We try to read the logged-in user from localStorage.
//   |
//   | If your login code stores:
//   |
//   | localStorage.setItem("user", JSON.stringify(user))
//   |
//   | this will automatically show the logged-in user.
//   |--------------------------------------------------------------------------
//   */

//   useEffect(() => {
//     try {
//       const storedUser = localStorage.getItem("user");

//       if (storedUser) {
//         const parsedUser = JSON.parse(storedUser);

//         setLoggedInUser(parsedUser);
//       }
//     } catch (error) {
//       console.error(
//         "Failed to load logged-in user:",
//         error
//       );
//     }
//   }, []);

//   /*
//   |--------------------------------------------------------------------------
//   | Clear Message
//   |--------------------------------------------------------------------------
//   */

//   const clearMessage = () => {
//     if (message.text) {
//       setMessage({
//         type: "",
//         text: "",
//       });
//     }
//   };

//   /*
//   |--------------------------------------------------------------------------
//   | Permission Change
//   |--------------------------------------------------------------------------
//   */

//   const handlePermissionChange = (permissionName) => {
//     setPermissions((previous) => {
//       /*
//       |--------------------------------------------------------------------------
//       | All Permissions
//       |--------------------------------------------------------------------------
//       */

//       if (permissionName === "all_perm") {
//         const newValue = !previous.all_perm;

//         return {
//           all_perm: newValue,
//           create_perm: newValue,
//           read_perm: newValue,
//           update_perm: newValue,
//           temp_update_permission: newValue,
//           delete_perm: newValue,
//         };
//       }

//       /*
//       |--------------------------------------------------------------------------
//       | Individual Permission
//       |--------------------------------------------------------------------------
//       */

//       const updatedPermissions = {
//         ...previous,
//         [permissionName]: !previous[permissionName],
//       };

//       /*
//       |--------------------------------------------------------------------------
//       | Automatically update All Permissions
//       |--------------------------------------------------------------------------
//       */

//       const allIndividualPermissionsSelected =
//         updatedPermissions.create_perm &&
//         updatedPermissions.read_perm &&
//         updatedPermissions.update_perm &&
//         updatedPermissions.temp_update_permission &&
//         updatedPermissions.delete_perm;

//       updatedPermissions.all_perm =
//         allIndividualPermissionsSelected;

//       return updatedPermissions;
//     });

//     clearMessage();
//   };

//   /*
//   |--------------------------------------------------------------------------
//   | Submit
//   |--------------------------------------------------------------------------
//   */

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     setMessage({
//       type: "",
//       text: "",
//     });

//     /*
//     |--------------------------------------------------------------------------
//     | Target User Validation
//     |--------------------------------------------------------------------------
//     */

//     if (!userId) {
//       setMessage({
//         type: "error",
//         text: "Please select the user who should receive this permission.",
//       });

//       return;
//     }

//     /*
//     |--------------------------------------------------------------------------
//     | Role Validation
//     |--------------------------------------------------------------------------
//     */

//     if (!roleId) {
//       setMessage({
//         type: "error",
//         text: "Please select a role.",
//       });

//       return;
//     }

//     /*
//     |--------------------------------------------------------------------------
//     | Department Validation
//     |--------------------------------------------------------------------------
//     */

//     if (!deptId) {
//       setMessage({
//         type: "error",
//         text: "Please select a department.",
//       });

//       return;
//     }

//     /*
//     |--------------------------------------------------------------------------
//     | Token Validation
//     |--------------------------------------------------------------------------
//     */

//     const token = localStorage.getItem("token");

//     if (!token) {
//       setMessage({
//         type: "error",
//         text: "Your session has expired. Please login again.",
//       });

//       return;
//     }

//     /*
//     |--------------------------------------------------------------------------
//     | API Payload
//     |--------------------------------------------------------------------------
//     |
//     | IMPORTANT:
//     |
//     | user_id = SELECTED TARGET USER
//     |
//     | The logged-in user's identity is represented by the
//     | Authorization Bearer token.
//     |--------------------------------------------------------------------------
//     */

//     const payload = {
//       user_id: Number(userId),
//       role_id: Number(roleId),
//       dept_id: Number(deptId),

//       all_perm: permissions.all_perm,
//       create_perm: permissions.create_perm,
//       read_perm: permissions.read_perm,
//       update_perm: permissions.update_perm,
//       temp_update_permission:
//         permissions.temp_update_permission,
//       delete_perm: permissions.delete_perm,
//     };

//     console.log(
//       "Logged-in User:",
//       loggedInUser
//     );

//     console.log(
//       "Permission Payload:",
//       payload
//     );

//     try {
//       setLoading(true);

//       const response =
//         await permissionService.createPermission(
//           payload
//         );

//       console.log(
//         "Create Permission Response:",
//         response
//       );

//       setMessage({
//         type: "success",
//         text: "Permission assigned successfully.",
//       });

//       /*
//       |--------------------------------------------------------------------------
//       | Reset
//       |--------------------------------------------------------------------------
//       */

//       setUserId("");
//       setRoleId("");
//       setDeptId("");

//       setPermissions({
//         all_perm: false,
//         create_perm: false,
//         read_perm: false,
//         update_perm: false,
//         temp_update_permission: false,
//         delete_perm: false,
//       });
//     } catch (error) {
//       console.error(
//         "Create Permission Error:",
//         error
//       );

//       const errorMessage =
//         error?.response?.data?.message ||
//         error?.response?.data?.detail ||
//         error?.response?.data?.error ||
//         error?.message ||
//         "Failed to assign permission.";

//       setMessage({
//         type: "error",
//         text: errorMessage,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   /*
//   |--------------------------------------------------------------------------
//   | Permission Options
//   |--------------------------------------------------------------------------
//   */

//   const permissionOptions = [
//     {
//       key: "all_perm",
//       label: "All Permissions",
//       description:
//         "Give the selected user all available permissions.",
//     },
//     {
//       key: "create_perm",
//       label: "Create",
//       description:
//         "Allow the selected user to create records.",
//     },
//     {
//       key: "read_perm",
//       label: "Read",
//       description:
//         "Allow the selected user to view records.",
//     },
//     {
//       key: "update_perm",
//       label: "Update",
//       description:
//         "Allow the selected user to update records.",
//     },
//     {
//       key: "temp_update_permission",
//       label: "Temporary Update",
//       description:
//         "Allow temporary update permission.",
//     },
//     {
//       key: "delete_perm",
//       label: "Delete",
//       description:
//         "Allow the selected user to delete records.",
//     },
//   ];

//   /*
//   |--------------------------------------------------------------------------
//   | Logged-in User Display
//   |--------------------------------------------------------------------------
//   */

//   const loggedInUserName =
//     loggedInUser?.name ||
//     loggedInUser?.username ||
//     loggedInUser?.employee_name ||
//     loggedInUser?.employee_id ||
//     "Current Logged-in User";

//   const loggedInUserId =
//     loggedInUser?.id ||
//     loggedInUser?.user_id ||
//     loggedInUser?.employee_id ||
//     null;

//   return (
//     <div className="min-h-screen bg-[#f4f8fd] p-4 sm:p-6 lg:p-8">
//       <div className="mx-auto max-w-4xl">

//         {/* ==========================================================
//             Back
//         ========================================================== */}

//         <div className="mb-6">
//           <Link
//             href="/permissions"
//             className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Back to Permissions
//           </Link>
//         </div>

//         {/* ==========================================================
//             Header
//         ========================================================== */}

//         <div className="mb-6">
//           <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
//             <KeyRound className="h-7 w-7" />
//           </div>

//           <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
//             Assign Permission
//           </h1>

//           <p className="mt-2 text-sm text-slate-500">
//             Assign a role, department and permissions to a user.
//           </p>
//         </div>

//         {/* ==========================================================
//             Logged-in User
//         ========================================================== */}

//         <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-4">
//           <div className="flex items-center gap-3">

//             <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
//               <UserRound className="h-5 w-5" />
//             </div>

//             <div className="min-w-0">
//               <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
//                 Logged in as
//               </p>

//               <p className="truncate text-sm font-bold text-slate-900">
//                 {loggedInUserName}
//               </p>

//               {loggedInUserId && (
//                 <p className="text-xs text-slate-500">
//                   User ID: {loggedInUserId}
//                 </p>
//               )}
//             </div>

//           </div>
//         </div>

//         {/* ==========================================================
//             Main Form
//         ========================================================== */}

//         <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

//           <form onSubmit={handleSubmit}>

//             {/* ======================================================
//                 Target User / Role / Department
//             ====================================================== */}

//             <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

//               {/* ====================================================
//                   Target User
//               ==================================================== */}

//               <div>
//                 <label
//                   htmlFor="userId"
//                   className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
//                 >
//                   <UserRound className="h-4 w-4 text-blue-600" />
//                   Assign To User
//                 </label>

//                 <select
//                   id="userId"
//                   value={userId}
//                   onChange={(event) => {
//                     setUserId(event.target.value);
//                     clearMessage();
//                   }}
//                   disabled={loading}
//                   className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
//                 >
//                   <option value="">
//                     Select User
//                   </option>

//                   {users.map((user) => (
//                     <option
//                       key={user.id}
//                       value={user.id}
//                     >
//                       {user.id} — {user.name}
//                     </option>
//                   ))}
//                 </select>

//                 <p className="mt-2 text-xs text-slate-400">
//                   Select the user who should receive this permission.
//                 </p>
//               </div>

//               {/* ====================================================
//                   Role
//               ==================================================== */}

//               <div>
//                 <label
//                   htmlFor="roleId"
//                   className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
//                 >
//                   <ShieldCheck className="h-4 w-4 text-blue-600" />
//                   Role
//                 </label>

//                 <select
//                   id="roleId"
//                   value={roleId}
//                   onChange={(event) => {
//                     setRoleId(event.target.value);
//                     clearMessage();
//                   }}
//                   disabled={loading}
//                   className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
//                 >
//                   <option value="">
//                     Select Role
//                   </option>

//                   {roles.map((role) => (
//                     <option
//                       key={role.id}
//                       value={role.id}
//                     >
//                       {role.id} — {role.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* ====================================================
//                   Department
//               ==================================================== */}

//               <div>
//                 <label
//                   htmlFor="deptId"
//                   className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
//                 >
//                   <Building2 className="h-4 w-4 text-blue-600" />
//                   Department
//                 </label>

//                 <select
//                   id="deptId"
//                   value={deptId}
//                   onChange={(event) => {
//                     setDeptId(event.target.value);
//                     clearMessage();
//                   }}
//                   disabled={loading}
//                   className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
//                 >
//                   <option value="">
//                     Select Department
//                   </option>

//                   {departments.map((department) => (
//                     <option
//                       key={department.id}
//                       value={department.id}
//                     >
//                       {department.id} — {department.name}
//                     </option>
//                   ))}
//                 </select>

//                 <p className="mt-2 text-xs text-slate-400">
//                   Dummy departments for now. This will use the Department API later.
//                 </p>
//               </div>

//             </div>

//             {/* ======================================================
//                 Permissions
//             ====================================================== */}

//             <div className="mt-8">

//               <div className="mb-4 flex items-center gap-3">

//                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
//                   <UsersRound className="h-5 w-5" />
//                 </div>

//                 <div>
//                   <h2 className="text-base font-bold text-slate-900">
//                     Permissions
//                   </h2>

//                   <p className="text-xs text-slate-500">
//                     Select what the selected user is allowed to do.
//                   </p>
//                 </div>

//               </div>

//               <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

//                 {permissionOptions.map((permission) => (
//                   <label
//                     key={permission.key}
//                     className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
//                       permissions[permission.key]
//                         ? "border-blue-300 bg-blue-50"
//                         : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50"
//                     }`}
//                   >
//                     <input
//                       type="checkbox"
//                       checked={permissions[permission.key]}
//                       onChange={() =>
//                         handlePermissionChange(
//                           permission.key
//                         )
//                       }
//                       disabled={loading}
//                       className="mt-1 h-4 w-4 cursor-pointer accent-blue-600"
//                     />

//                     <div>
//                       <p className="text-sm font-semibold text-slate-800">
//                         {permission.label}
//                       </p>

//                       <p className="mt-1 text-xs leading-5 text-slate-500">
//                         {permission.description}
//                       </p>
//                     </div>
//                   </label>
//                 ))}

//               </div>
//             </div>

//             {/* ======================================================
//                 Message
//             ====================================================== */}

//             {message.text && (
//               <div
//                 className={`mt-6 flex items-start gap-3 rounded-xl border p-4 ${
//                   message.type === "success"
//                     ? "border-emerald-200 bg-emerald-50 text-emerald-700"
//                     : "border-red-200 bg-red-50 text-red-700"
//                 }`}
//               >
//                 {message.type === "success" ? (
//                   <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
//                 ) : (
//                   <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
//                 )}

//                 <p className="text-sm font-medium">
//                   {message.text}
//                 </p>
//               </div>
//             )}

//             {/* ======================================================
//                 Buttons
//             ====================================================== */}

//             <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

//               <Link
//                 href="/permissions"
//                 className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
//               >
//                 Cancel
//               </Link>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-700 hover:to-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     Assigning...
//                   </>
//                 ) : (
//                   <>
//                     <Save className="h-4 w-4" />
//                     Assign Permission
//                   </>
//                 )}
//               </button>

//             </div>

//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }