import type React from "react"
import { useDroppable } from "@dnd-kit/core"
import { Badge } from "@/components/ui/badge"

interface KanbanColumnProps {
  id: string
  title: string
  count: number
  color: string
  children: React.ReactNode
}

export function KanbanColumn({ id, title, count, color, children }: KanbanColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  })

  const getColumnIcon = (id: string) => {
    switch (id) {
      case "todo":
        return "🔴"
      case "in-progress":
        return "🟡"
      case "done":
        return "🟢"
      default:
        return "📋"
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center">
          <span className="mr-2">{getColumnIcon(id)}</span>
          {title}
        </h3>
        <Badge variant="secondary" className="text-xs">
          {count}
        </Badge>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 min-h-[500px] p-4 rounded-lg transition-all duration-200 ${color} ${
          isOver ? "ring-2 ring-blue-500 ring-opacity-50 scale-105" : ""
        }`}
      >
        <div className="space-y-3">{children}</div>
      </div>
    </div>
  )
}
