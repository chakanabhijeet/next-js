// "use client";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// import { useUsersViewModel } from "../view-models/use-users-view-model";

// export default function UsersView() {
//   const {
//     users,
//     isLoading,
//     isError,
//   } = useUsersViewModel();

//   if (isLoading) {
//     return <div>Loading users...</div>;
//   }

//   if (isError) {
//     return <div>Unable to load users.</div>;
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Users</CardTitle>
//       </CardHeader>

//       <CardContent>
//         <pre className="overflow-auto text-sm">
//           {JSON.stringify(users, null, 2)}
//         </pre>
//       </CardContent>
//     </Card>
//   );
// }