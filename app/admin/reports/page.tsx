import { ReportsTable } from "@/components/reports/reports-table"

export default function ReportsAdminPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-2 text-indigo-800">Reports Management</h1>
      <p className="text-slate-600 mb-6">View, validate, and manage all submitted reports</p>
      <ReportsTable />
    </div>
  )
}

