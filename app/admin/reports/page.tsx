import { ReportsTable } from "@/components/reports/reports-table"

export default function ReportsAdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-[80vw] mx-auto px-4 sm:px-6 py-12">
        {/* Header section with refined typography */}
        <div className="mb-10 space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-pfebrand">
            Reports Management
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl">
            View, validate, and manage all submitted reports in one place
          </p>
        </div>
        
        {/* Elevated card for content */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md">
          <div className="p-6">
            <ReportsTable />
          </div>
        </div>
      </div>
    </div>
  )
}