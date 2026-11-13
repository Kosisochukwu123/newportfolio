
import { AuthProvider } from "./admin/context/AuthContext";
import AdminApp from "./admin/AdminApp";

export default function AdminRoute() {
  return (
    <AuthProvider>
      <AdminApp />
    </AuthProvider>
  );
}
