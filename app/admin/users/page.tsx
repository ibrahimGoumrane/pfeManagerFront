import { UsersTable } from "@/components/users/users-table";

export default function ReportsAdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-[80vw] mx-auto px-4 sm:px-6 py-12">
        {/* Header section with refined typography */}
        <div className="mb-10 space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-pfebrand">
            Users Management
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl">
            View and manage user accounts and their associated sectors
          </p>
        </div>

        {/* Elevated card for content */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md">
          <div className="p-6">
            <UsersTable />
          </div>
        </div>
      </div>
    </div>
  );
}
