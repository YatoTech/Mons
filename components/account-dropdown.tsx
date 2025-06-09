"use client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Settings, Bell, HelpCircle, LogOut, Shield, CreditCard, Users, BarChart3, Cloud } from "lucide-react"
import type { User as UserType } from "@/lib/types"
import { useAuth } from "@/lib/auth"

interface AccountDropdownProps {
  user: UserType
  onOpenSettings: () => void
  onOpenProfile: () => void
  onOpenBackup: () => void
}

export function AccountDropdown({ user, onOpenSettings, onOpenProfile, onOpenBackup }: AccountDropdownProps) {
  const { logout } = useAuth()

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      logout()
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user.avatar_url || "/placeholder.svg"} />
            <AvatarFallback>
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="text-left hidden md:block">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-gray-600">{user.email}</p>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64" align="end">
        <DropdownMenuLabel>
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user.avatar_url || "/placeholder.svg"} />
              <AvatarFallback>
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-xs text-gray-600">{user.email}</p>
              <Badge variant={user.role === "admin" ? "default" : "secondary"} className="text-xs mt-1">
                {user.role}
              </Badge>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onOpenProfile}>
          <User className="w-4 h-4 mr-2" />
          View Profile
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onOpenSettings}>
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onOpenBackup}>
          <Cloud className="w-4 h-4 mr-2" />
          Backup & Sync
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Bell className="w-4 h-4 mr-2" />
          Notifications
        </DropdownMenuItem>

        {user.role === "admin" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Shield className="w-4 h-4 mr-2" />
              Admin Panel
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Users className="w-4 h-4 mr-2" />
              Manage Users
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <CreditCard className="w-4 h-4 mr-2" />
          Billing
        </DropdownMenuItem>

        <DropdownMenuItem>
          <HelpCircle className="w-4 h-4 mr-2" />
          Help & Support
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
