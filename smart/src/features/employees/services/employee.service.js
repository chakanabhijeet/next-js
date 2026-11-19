import apiClient from "@/lib/axios/client";
import { API_ENDPOINTS } from "@/config/api-endpoints";
import { DEPARTMENTS, ROLES } from "../models/employee.model";

/*
|--------------------------------------------------------------------------
| MOCK MODE
|--------------------------------------------------------------------------
| No API yet, so everything answers instantly from memory.
| When the API is ready:
|   1. add EMPLOYEES.CREATE, DEPARTMENTS.LIST and ROLES.LIST to
|      api-endpoints.js
|   2. set USE_MOCK = false
| Nothing else in the app has to change.
|--------------------------------------------------------------------------
*/
const USE_MOCK = true;

// Keep at 0 so saving feels instant. (Raise it only to test a slow server.)
const MOCK_DELAY_MS = 0;

const wait = (ms) =>
  ms > 0 ? new Promise((resolve) => setTimeout(resolve, ms)) : Promise.resolve();

// People "saved" during this browser session (mock only)
const mockEmployees = [{ employee_id: "bhupendra@apipl" }];

function mockError(message, status) {
  const error = new Error(message);
  error.response = { status, data: { message } };
  return error;
}

export const employeeService = {
  getDepartments: async () => {
    if (USE_MOCK) {
      await wait(MOCK_DELAY_MS);
      return DEPARTMENTS;
    }

    const response = await apiClient.get(API_ENDPOINTS.DEPARTMENTS.LIST);
    return response.data;
  },

  getRoles: async () => {
    if (USE_MOCK) {
      await wait(MOCK_DELAY_MS);
      return ROLES;
    }

    const response = await apiClient.get(API_ENDPOINTS.ROLES.LIST);
    return response.data;
  },

  createEmployee: async (payload) => {
    if (USE_MOCK) {
      await wait(MOCK_DELAY_MS);

      const exists = mockEmployees.some(
        (item) =>
          item.employee_id.toLowerCase() === payload.employee_id.toLowerCase()
      );

      if (exists) {
        throw mockError("This Employee ID is already registered.", 409);
      }

      // Never keep the password around, even in the mock
      const saved = { ...payload };
      delete saved.password;

      mockEmployees.push(saved);

      return { id: String(mockEmployees.length), ...saved };
    }

    const response = await apiClient.post(
      API_ENDPOINTS.EMPLOYEES.CREATE,
      payload
    );

    return response.data;
  },
};