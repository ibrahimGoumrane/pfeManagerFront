"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { UserCog } from "lucide-react"
import { toast } from "sonner"
interface Sector {
  id: string
  name: string
}

interface User {
  id: number
  name: string
  email: string
  role: string
  sectorId: string
  sectorName: string
  [key: string]: any
}

interface UserDetailsProps {
  user: User
  sectors: Sector[]
  onUpdate: (user: User) => void
  handleSelectUser: (userId: number) => void
}

export function UserDetails({ user, sectors, onUpdate , handleSelectUser }: UserDetailsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<User>({ ...user })


  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "sectorId" && {
        sectorName: sectors.find((s) => s.id === value)?.name || "",
      }),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, this would call a server action to update the user
      // await updateUser(formData)

      // For demo purposes, we'll just use the callback
      onUpdate(formData)
      toast.success("User updated", {
        description: `${formData.name}'s details have been updated successfully.`,
        action: {
          label: "Close",
          onClick: () => console.log("Close"),
        },
      })

      setIsOpen(false)
    } catch (error) {
      console.error("Error updating user:", error)
      toast.error("Error", {
        description: `Error updating user: ${error}`,
        action: {
          label: "Close",
          onClick: () => console.log("Close"),
        },
      })
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    if (isOpen) {
      handleSelectUser(user.id)
    }
  }, [isOpen, user.id, handleSelectUser])
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-pfebrand hover:bg-pfebrand/10 hover:text-pfebrand/80 cursor-pointer"> 
          <UserCog className="h-4 w-4 mr-1" />
          <span className="sr-only sm:not-sr-only sm:inline-block">Manage</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Update user details and sector assignment</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sector" className="text-right">
                Sector
              </Label>
              <Select value={formData.sectorId}  onValueChange={(value) => handleChange("sectorId", value)}>
                <SelectTrigger className="col-span-3 w-full">
                  <SelectValue placeholder="Select a sector" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map((sector) => (
                    <SelectItem key={sector.id} value={sector.id}>
                      {sector.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Role</Label>
              <RadioGroup
                value={formData.role}
                onValueChange={(value) => handleChange("role", value)}
                className="col-span-3 flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="admin" id="admin" />
                  <Label htmlFor="admin">Admin</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="manager" id="manager" />
                  <Label htmlFor="manager">Manager</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="user" id="user" />
                  <Label htmlFor="user">User</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-pfebrand hover:bg-pfebrand/80" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

