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
import { User } from "@/type/users"
import { Sector } from "@/type/sector"
import { updateUser as updateUserApi } from "@/network/users"

interface UserDetailsProps {
  user: User
  sectors: Sector[]
  onUpdate: (user: User) => void
  handleSelectUser: (userId: number) => void
}

export function UserDetails({ user, sectors, onUpdate, handleSelectUser }: UserDetailsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<User>({ ...user })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "sectorId" && {
        sectorName: sectors.find((s) => s.id === +value)?.name || "",
      }),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      
      await updateUserApi(user.id ,  formData)
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
      <DialogContent className="sm:max-w-md border border-pfebrand/20 shadow-md shadow-pfebrand/5">
        <DialogHeader className="border-b border-pfebrand/10 pb-4">
          <DialogTitle className="text-pfebrand/90 text-xl">Edit User</DialogTitle>
          <DialogDescription className="text-pfebrand/60">
            Update user details and sector assignment
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-pfebrand/80">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="col-span-3 border-pfebrand/20 focus-visible:ring-pfebrand/30"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right text-pfebrand/80">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="col-span-3 border-pfebrand/20 focus-visible:ring-pfebrand/30"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sector" className="text-right text-pfebrand/80">
                Sector
              </Label>
              <Select 
                value={(formData.sector.id).toString()} 
                onValueChange={(value) => handleChange("sectorId", value)}
              >
                <SelectTrigger className="col-span-3 w-full border-pfebrand/20 focus:ring-pfebrand/30 text-pfebrand/80">
                  <SelectValue placeholder="Select a sector" />
                </SelectTrigger>
                <SelectContent className="border-pfebrand/20">
                  {sectors.map((sector) => (
                    <SelectItem 
                      key={sector.id} 
                      value={(sector.id).toString()}
                      className="focus:bg-pfebrand/10 focus:text-pfebrand"
                    >
                      {sector.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-pfebrand/80">Role</Label>
              <RadioGroup
                value={formData.role}
                onValueChange={(value) => handleChange("role", value)}
                className="col-span-3 flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="admin" 
                    id="admin" 
                    className="text-pfebrand border-pfebrand/30 focus:ring-pfebrand/20 data-[state=checked]:bg-pfebrand data-[state=checked]:text-white"
                  />
                  <Label htmlFor="admin" className="text-pfebrand/70">Admin</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="user" 
                    id="user"
                    className="text-pfebrand border-pfebrand/30 focus:ring-pfebrand/20 data-[state=checked]:bg-pfebrand data-[state=checked]:text-white" 
                  />
                  <Label htmlFor="user" className="text-pfebrand/70">User</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter className="border-t border-pfebrand/10 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="border-pfebrand/20 text-pfebrand/80 hover:bg-pfebrand/5 hover:text-pfebrand"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-pfebrand hover:bg-pfebrand/90 text-white" 
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}