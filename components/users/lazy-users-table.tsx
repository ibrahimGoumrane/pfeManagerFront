"use client"

import { Suspense, lazy } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// Lazy load the UsersTable component
const UsersTable = lazy(() =>
  import("./users-table").then((mod) => ({
    default: mod.UsersTable,
  })),
)

export function LazyUsersTable() {
  return (
    <Suspense fallback={<UsersTableSkeleton />}>
      <UsersTable />
    </Suspense>
  )
}

function UsersTableSkeleton() {
  return (
    <Card className="shadow-md border-0">
      <CardHeader className="bg-gradient-to-r from-pfebrand/10 to-pfebrand/5 rounded-t-lg">
        <CardTitle className="text-pfebrand">
          <Skeleton className="h-8 w-40" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-64 mt-2" />
        </CardDescription>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Skeleton className="h-10 w-full sm:w-2/3" />
          <Skeleton className="h-10 w-full sm:w-32" />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-b-md overflow-hidden">
          <Skeleton className="h-[400px] w-full" />
        </div>
      </CardContent>
    </Card>
  )
}

