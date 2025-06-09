"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Crown, User, Mail, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { User as UserType } from "@/lib/types"

interface TeamModalProps {
  isOpen: boolean
  onClose: () => void
  users: UserType[]
}

export function TeamModal({ isOpen, onClose, users }: TeamModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Personal Workspace</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current User */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Workspace Owner</h4>
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
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
                      <p className="font-medium text-sm">{user.name}</p>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Mail className="w-3 h-3" />
                        <span>{user.email}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="default">
                    <Crown className="w-3 h-3 mr-1" />
                    Owner
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Invite Section */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-3">Invite Team Members</h4>
            <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
              <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 mb-3">Invite team members to collaborate on your projects</p>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Invite Members
              </Button>
            </div>
          </div>

          {/* Workspace Info */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <h5 className="font-medium text-blue-900 text-sm mb-1">Personal Workspace</h5>
            <p className="text-xs text-blue-700">
              This is your personal workspace. You can invite team members to collaborate on projects.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
