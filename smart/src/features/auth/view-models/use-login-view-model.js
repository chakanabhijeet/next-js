// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useMutation } from "@tanstack/react-query";

// import { authService } from "../services/auth.service";
// import { loginSchema } from "../models/login.schema";
// import { useAuthStore } from "../store/auth.store";

// import { ROUTES } from "@/constants/routes";

// export function useLoginViewModel() {
//   const router = useRouter();

//   const setAuth = useAuthStore((state) => state.setAuth);

//   const [serverError, setServerError] = useState("");

//   const form = useForm({
//     resolver: zodResolver(loginSchema),

//     defaultValues: {
//       employee_id: "",
//       password: "",
//     },
//   });

//   const loginMutation = useMutation({
//     mutationFn: authService.login,

//     onSuccess: (response) => {
//       if (!response?.token) {
//         setServerError(
//           "Login succeeded, but authentication token was not returned by the API."
//         );

//         return;
//       }

//       setAuth({
//         user: response.user,
//         token: response.token,
//       });

//       router.replace(ROUTES.DASHBOARD);
//     },

//     onError: (error) => {
//       const message =
//         error?.response?.data?.message ||
//         error?.response?.data?.error ||
//         "Unable to login. Please check your credentials.";

//       setServerError(message);
//     },
//   });

//   const onSubmit = async (formData) => {
//     setServerError("");

//     await loginMutation.mutateAsync(formData);
//   };

//   return {
//     form,

//     serverError,

//     isLoading: loginMutation.isPending,

//     onSubmit,

//     loginMutation,
//   };
// }





"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import { authService } from "../services/auth.service";
import { loginSchema } from "../models/login.schema";
import { useAuthStore } from "../store/auth.store";

import { ROUTES } from "@/constants/routes";

export function useLoginViewModel() {
  const router = useRouter();

  const setAuth = useAuthStore((state) => state.setAuth);

  const [serverError, setServerError] = useState("");

  const form = useForm({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      employee_id: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,

    onSuccess: (response) => {
      /*
      |--------------------------------------------------------------------------
      | Check Token
      |--------------------------------------------------------------------------
      */

      if (!response?.token) {
        setServerError(
          "Login succeeded, but authentication token was not returned by the API."
        );

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Save Authentication in Zustand
      |--------------------------------------------------------------------------
      */

      setAuth({
        user: response.user,
        token: response.token,
      });

      /*
      |--------------------------------------------------------------------------
      | Save Token in Local Storage
      |--------------------------------------------------------------------------
      */

      localStorage.setItem(
        "token",
        response.token
      );

      /*
      |--------------------------------------------------------------------------
      | Save Logged-in User in Local Storage
      |--------------------------------------------------------------------------
      |
      | This allows other pages such as:
      |
      | Permissions
      | Departments
      | Dashboard
      |
      | to know who is currently logged in.
      |--------------------------------------------------------------------------
      */

      if (response.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.user)
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Go to Dashboard
      |--------------------------------------------------------------------------
      */

      router.replace(ROUTES.DASHBOARD);
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        "Unable to login. Please check your credentials.";

      setServerError(message);
    },
  });

  const onSubmit = async (formData) => {
    setServerError("");

    await loginMutation.mutateAsync(formData);
  };

  return {
    form,

    serverError,

    isLoading: loginMutation.isPending,

    onSubmit,

    loginMutation,
  };
}