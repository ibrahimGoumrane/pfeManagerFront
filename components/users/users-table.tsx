"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, FileText } from "lucide-react"
import { UserDetails } from "./user-details"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data - replace with actual data fetching
const mockUsers = [
  {
    id: "user1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    emailVerifiedAt: "2023-01-15T10:30:00Z",
    sectorId: "sector1",
    sectorName: "Finance",
    reportsCount: 2,
  },
  {
    id: "user2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "user",
    emailVerifiedAt: "2023-02-20T14:20:00Z",
    sectorId: "sector2",
    sectorName: "IT Security",
    reportsCount: 1,
  },
  {
    id: "user3",
    name: "Robert Johnson",
    email: "robert@example.com",
    role: "user",
    emailVerifiedAt: "2023-01-05T09:15:00Z",
    sectorId: "sector3",
    sectorName: "Legal",
    reportsCount: 1,
  },
  {
    id: "user4",
    name: "Sarah Williams",
    email: "sarah@example.com",
    role: "manager",
    emailVerifiedAt: "2023-03-10T16:45:00Z",
    sectorId: "sector4",
    sectorName: "Product",
    reportsCount: 1,
  },
  {
    id: "user5",
    name: "Michael Brown",
    email: "michael@example.com",
    role: "user",
    emailVerifiedAt: null,
    sectorId: "sector1",
    sectorName: "Finance",
    reportsCount: 0,
  },
]

// Mock sectors data
const mockSectors = [
  { id: "sector1", name: "Finance" },
  { id: "sector2", name: "IT Security" },
  { id: "sector3", name: "Legal" },
  { id: "sector4", name: "Product" },
  { id: "sector5", name: "Marketing" },
  { id: "sector6", name: "Human Resources" },
]

export function UsersTable() {
  const [users, setUsers] = useState(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState<string>("all")
  const [filterSector, setFilterSector] = useState<string>("all")

  const filteredUsers = users
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.sectorName.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((user) => {
      if (filterRole === "all") return true
      return user.role === filterRole
    })
    .filter((user) => {
      if (filterSector === "all") return true
      return user.sectorId === filterSector
    })

  const handleUpdateUser = (updatedUser: any) => {
    setUsers(users.map((user) => (user.id === updatedUser.id ? { ...user, ...updatedUser } : user)))
  }

  return (
    <Card className="shadow-md border-0">
      <CardHeader className="bg-gradient-to-r from-pfebrand/10 to-pfebrand/5 rounded-t-lg">
        <CardTitle className="text-pfebrand">All Users</CardTitle>
        <CardDescription>Manage user accounts and their associated sectors</CardDescription>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name, email, or sector..."
              className="pl-8 border-pfebrand/20 focus-visible:ring-pfebrand/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 border-pfebrand/20 text-pfebrand">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => setFilterRole("all")}
                  className={filterRole === "all" ? "bg-pfebrand/10 text-pfebrand" : ""}
                >
                  All Roles
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterRole("admin")}
                  className={filterRole === "admin" ? "bg-pfebrand/10 text-pfebrand" : ""}
                >
                  Admin
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterRole("manager")}
                  className={filterRole === "manager" ? "bg-pfebrand/10 text-pfebrand" : ""}
                >
                  Manager
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterRole("user")}
                  className={filterRole === "user" ? "bg-pfebrand/10 text-pfebrand" : ""}
                >
                  User
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Filter by Sector</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => setFilterSector("all")}
                  className={filterSector === "all" ? "bg-pfebrand/10 text-pfebrand" : ""}
                >
                  All Sectors
                </DropdownMenuItem>
                {mockSectors.map((sector) => (
                  <DropdownMenuItem
                    key={sector.id}
                    onClick={() => setFilterSector(sector.id)}
                    className={filterSector === sector.id ? "bg-pfebrand/10 text-pfebrand" : ""}
                  >
                    {sector.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-b-md overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-100">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Reports</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <RoleBadge role={user.role} />
                    </TableCell>
                    <TableCell>{user.sectorName}</TableCell>
                    <TableCell>
                      {user.emailVerifiedAt ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3 text-slate-400" />
                        <span>{user.reportsCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <UserDetails user={user} sectors={mockSectors} onUpdate={handleUpdateUser} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

function RoleBadge({ role }: { role: string }) {
  switch (role) {
    case "admin":
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Admin</Badge>
    case "manager":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Manager</Badge>
    default:
      return <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100">User</Badge>
  }
}

