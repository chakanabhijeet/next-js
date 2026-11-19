"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";

import { employeeService } from "../services/employee.service";
import { employeeSchema } from "../models/employee.schema";
import { buildEmployeePayload } from "../models/employee.model";

const EMPTY_FORM = {
  fullName: "",
  employeeId: "",
  email: "",
  phone: "",
  departmentId: "",
  roleId: "",
  password: "",
  confirmPassword: "",
};

// 12 characters with a letter, a number and a symbol
function generateStrongPassword() {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  const numbers = "23456789";
  const symbols = "@#$%&*!?";
  const all = letters + numbers + symbols;

  const random = new Uint32Array(12);
  crypto.getRandomValues(random);

  const chars = [
    letters[random[0] % letters.length],
    numbers[random[1] % numbers.length],
    symbols[random[2] % symbols.length],
  ];

  for (let i = 3; i < 12; i += 1) {
    chars.push(all[random[i] % all.length]);
  }

  // Shuffle so the first three are not always letter, number, symbol
  return chars
    .map((char, index) => ({ char, sort: random[(index + 5) % 12] }))
    .sort((a, b) => a.sort - b.sort)
    .map((item) => item.char)
    .join("");
}

export function useCreateEmployeeViewModel() {
  const [serverError, setServerError] = useState("");
  const [createdEmployee, setCreatedEmployee] = useState(null);

  const form = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: EMPTY_FORM,
    mode: "onTouched",
  });

  // Dropdown lists are cached, so the form opens instantly after the first load
  const departmentsQuery = useQuery({
    queryKey: ["departments"],
    queryFn: employeeService.getDepartments,
    staleTime: 10 * 60 * 1000,
  });

  const rolesQuery = useQuery({
    queryKey: ["roles"],
    queryFn: employeeService.getRoles,
    staleTime: 10 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: (values) =>
      employeeService.createEmployee(buildEmployeePayload(values)),

    onSuccess: (employee, values) => {
      // The password is kept in memory only so it can be shown (and copied)
      // once in the success box. It is never saved anywhere.
      setCreatedEmployee({ ...employee, tempPassword: values.password });
      form.reset(EMPTY_FORM);
    },

    onError: (error) => {
      setServerError(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.response?.data?.detail ||
          "Unable to register this person. Please try again."
      );
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    setServerError("");
    setCreatedEmployee(null);
    createMutation.mutate(values);
  });

  const generatePassword = () => {
    const password = generateStrongPassword();

    form.setValue("password", password, { shouldValidate: true });
    form.setValue("confirmPassword", password, { shouldValidate: true });

    return password;
  };

  return {
    form,
    onSubmit,

    departments: departmentsQuery.data ?? [],
    roles: rolesQuery.data ?? [],
    isLoadingLists: departmentsQuery.isLoading || rolesQuery.isLoading,

    isSaving: createMutation.isPending,
    serverError,
    createdEmployee,
    dismissCreated: () => setCreatedEmployee(null),

    generatePassword,
  };
}