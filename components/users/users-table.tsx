"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, FileText } from "lucide-react";
import { UserDetails } from "./user-details";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/type/users";
import { fetchUsers } from "@/network/users";
import { Sector } from "@/type/sector";
import { fetchSectors } from "@/network/sector";
import { useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";

export interface UsersTableProps {
  userId: string | undefined;
}

export function UsersTable({ userId }: UsersTableProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<number | undefined>(
    userId ? +userId : undefined
  );
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterSector, setFilterSector] = useState<string>("all");

  const filteredUsers = users
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.sector?.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((user) => {
      if (filterRole === "all") return true;
      return user.role === filterRole;
    })
    .filter((user) => {
      if (filterSector === "all") return true;
      return user.sector.id === +filterSector;
    });

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(
      users.map((user) =>
        user.id === updatedUser.id ? { ...user, ...updatedUser } : user
      )
    );
  };
  const handleSelectUser = (userId: number) => {
    setSelectedUser(userId);
  };

  // Fetch users and sectors data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users data
        const userData = await fetchUsers();
        setUsers(userData);

        // Fetch sectors data
        const sectorData = await fetchSectors();
        setSectors(sectorData);

        // If a userId is provided, make sure it's selected
        if (userId) {
          setSelectedUser(+userId);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data", {
          description: "Using sample data instead. Please try again later.",
        });
      }
    };

    fetchData();
  }, [userId]); // Re-fetch if userId changes

  return (
    <Card className="shadow-md border-0">
      <CardHeader className="bg-gradient-to-r from-pfebrand/10 to-pfebrand/5 rounded-t-lg">
        <CardTitle className="text-pfebrand">All Users</CardTitle>
        <CardDescription>
          Manage user accounts and their associated sectors
        </CardDescription>
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
              <Button
                variant="outline"
                className="flex items-center gap-2 border-pfebrand/20 text-pfebrand"
              >
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
                  className={
                    filterRole === "all" ? "bg-pfebrand/10 text-pfebrand" : ""
                  }
                >
                  All Roles
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterRole("admin")}
                  className={
                    filterRole === "admin" ? "bg-pfebrand/10 text-pfebrand" : ""
                  }
                >
                  Admin
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterRole("user")}
                  className={
                    filterRole === "user" ? "bg-pfebrand/10 text-pfebrand" : ""
                  }
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
                  className={
                    filterSector === "all" ? "bg-pfebrand/10 text-pfebrand" : ""
                  }
                >
                  All Sectors
                </DropdownMenuItem>
                {sectors.map((sector) => (
                  <DropdownMenuItem
                    key={sector.id}
                    onClick={() => setFilterSector(`${sector.id}`)}
                    className={
                      +filterSector === sector.id
                        ? "bg-pfebrand/10 text-pfebrand"
                        : ""
                    }
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
                <TableHead>Reports</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className={`border-l-4 border-transparent hover:bg-pfebrand/10 hover:border-pfebrand hover:shadow-sm ${
                      selectedUser && user.id === +selectedUser
                        ? "bg-pfebrand/10 border-l-4 border-pfebrand shadow-sm"
                        : ""
                    }`}
                  >
                    <TableCell className="font-medium">
                      {selectedUser && user.id === +selectedUser ? (
                        <span className="text-pfebrand">{user.name}</span>
                      ) : (
                        user.name
                      )}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <RoleBadge role={user.role} />
                    </TableCell>
                    <TableCell>{user.sector?.name}</TableCell>
                    <TableCell>
                      <div
                        className="flex items-center gap-1 text-sm
                              text-pfebrand hover:text-pfebrand/80
                             "
                      >
                        {user.reports ? (
                          <>
                            <FileText className="h-3 w-3 text-slate-400" />
                            <Link href={`/admin/reports/${user.reports.id}`} className="cursor-pointer hover:underline">
                              {user.reports.title.substring(0, 20) + "..."}
                            </Link>
                          </>
                        ) : (
                          <span>No report</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <UserDetails
                        user={user}
                        sectors={sectors}
                        onUpdate={handleUpdateUser}
                        handleSelectUser={handleSelectUser}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function RoleBadge({ role }: { role: string }) {
  switch (role) {
    case "admin":
      return (
        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
          Admin
        </Badge>
      );
    case "manager":
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          Manager
        </Badge>
      );
    default:
      return (
        <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100">
          User
        </Badge>
      );
  }
}
