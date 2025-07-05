import { AdminDashboard } from '@/components/admin-dashboard';

export default function AdminPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Painel do Administrador</h1>
      <AdminDashboard />
    </div>
  );
}
