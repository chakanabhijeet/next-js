import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // true once the saved login has been read back from localStorage.
      // Pages wait for this before deciding "logged in" or "logged out".
      hasHydrated: false,

      setHasHydrated: (value) => {
        set({ hasHydrated: value });
      },

      setAuth: ({ user, token }) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      setUser: (user) => {
        set({
          user,
        });
      },

      // The ONLY place a saved login is removed.
      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }

        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "xoomgrid-auth",

      // Save only the login data (not the hasHydrated flag)
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),

      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);