// "use client";

// import { useQuery } from "@tanstack/react-query";

// import { usersService } from "../services/users.service";

// export function useUsersViewModel() {
//   const query = useQuery({
//     queryKey: ["users"],
//     queryFn: usersService.getUsers,
//   });

//   return {
//     users: query.data,

//     isLoading: query.isLoading,

//     isError: query.isError,

//     error: query.error,

//     refetch: query.refetch,
//   };
// }