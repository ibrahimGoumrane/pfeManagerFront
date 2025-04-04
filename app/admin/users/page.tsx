import { UsersTable } from "@/components/users/users-table"

export default function UsersAdminPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-2 text-indigo-800">Users Management</h1>
      <p className="text-slate-600 mb-6">View and manage user accounts and their associated sectors</p>
      <UsersTable />
    </div>
  )
}

