"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import { SuperAdminGuard } from "@/components/common/role-guard";
import CreateEmployeeView from "@/features/employees/views/create-employee-view";

export default function CreateEmployeePage() {
  return (
    <DashboardLayout>
      {/* <SuperAdminGuard> */}
        <CreateEmployeeView />
      {/* </SuperAdminGuard> */}
    </DashboardLayout>
  );
}




// "use client";

// import CreateEmployeeView from "@/features/employees/views/create-employee-view";

// export default function CreateEmployeePage() {
//   return <CreateEmployeeView />;
// }