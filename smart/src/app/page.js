import LoginView from "@/features/auth/views/login-view";
import { GuestGuard } from "@/components/common/auth-guard";

export default function LoginPage() {
  return (
    <GuestGuard>
      <LoginView />
    </GuestGuard>
  );
}