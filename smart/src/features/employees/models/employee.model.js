// Static lists for now. When the APIs are ready, the service will load
// departments / roles from the server and these can be removed.

export const DEPARTMENTS = [
  { id: "1", name: "Production" },
  { id: "2", name: "Quality" },
  { id: "3", name: "Maintenance" },
  { id: "4", name: "Stores" },
  { id: "5", name: "Planning" },
  { id: "6", name: "HR & Admin" },
];

export const ROLES = [
  { id: "1", name: "Operator" },
  { id: "2", name: "Supervisor" },
  { id: "3", name: "Manager" },
  { id: "4", name: "Admin" },
];

// Turns the form values into the body the API will receive.
// When the real API is connected, this is the ONLY place to change the
// field names (employee_id, full_name, ...).
export function buildEmployeePayload(values) {
  return {
    employee_id: values.employeeId.trim(),
    full_name: values.fullName.trim(),
    email: values.email.trim().toLowerCase(),
    phone: values.phone.trim(),
    department_id: values.departmentId,
    role_id: values.roleId,
    password: values.password,
  };
}