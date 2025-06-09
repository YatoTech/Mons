"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, MessageCircle, Paperclip } from 'lucide-react'
import type { Task } from "@/lib/types"

interface TaskCardProps {
  task: Task
  onClick?: () => void
  isDragging?: boolean
}

export function TaskCard({ task, onClick, isDragging = false }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id.toString() })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const priorityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-pointer hover:shadow-md transition-shadow ${
        isDragging || isSortableDragging ? "opacity-50 rotate-3 shadow-lg" : ""
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
          <Badge className={`text-xs ${priorityColors[task.priority]}`}>{task.priority}</Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {task.description && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {task.due_date && (
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(task.due_date).toLocaleDateString()}
              </div>
            )}
          </div>

          {task.assignee && (
            <Avatar className="w-6 h-6">
              <AvatarImage src={task.assignee.avatar_url || "/placeholder.svg"} />
              <AvatarFallback className="text-xs">
                {task.assignee.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          )}
        </div>

        {((task.comments && task.comments.length > 0) || (task.attachments && task.attachments.length > 0)) && (
          <div className="flex items-center space-x-3 mt-2 pt-2 border-t">
            {task.comments && task.comments.length > 0 && (
              <div className="flex items-center text-xs text-gray-500">
                <MessageCircle className="w-3 h-3 mr-1" />
                {task.comments.length}
              </div>
            )}
            {task.attachments && task.attachments.length > 0 && (
              <div className="flex items-center text-xs text-gray-500">
                <Paperclip className="w-3 h-3 mr-1" />
                {task.attachments.length}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
