"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MessageCircle, Trash2, Edit, Send } from "lucide-react"
import { updateTask, deleteTask, addComment, getTaskComments } from "@/lib/actions"
import type { Task, User, Comment } from "@/lib/types"
import { useAuth } from "@/lib/auth"

interface TaskDetailModalProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (task: Task) => void
  onDelete: (taskId: number) => void
  users: User[]
  dbConnected?: boolean
}

export function TaskDetailModal({
  task,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  users,
  dbConnected = false,
}: TaskDetailModalProps) {
  const { user: currentUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    assigneeId: "none",
    dueDate: "",
  })

  useEffect(() => {
    if (task && isOpen) {
      setFormData({
        title: task.title,
        description: task.description || "",
        status: task.status,
        priority: task.priority,
        assigneeId: task.assignee_id?.toString() || "none",
        dueDate: task.due_date || "",
      })
      loadComments()
    }
  }, [task, isOpen])

  const loadComments = async () => {
    if (!task) return

    if (dbConnected) {
      try {
        const taskComments = await getTaskComments(task.id)
        setComments(taskComments)
      } catch (error) {
        console.error("Error loading comments:", error)
        setComments(task.comments || [])
      }
    } else {
      // Use comments from task object in demo mode
      setComments(task.comments || [])
    }
  }

  if (!task) return null

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (dbConnected) {
        const formDataObj = new FormData()
        formDataObj.append("title", formData.title)
        formDataObj.append("description", formData.description)
        formDataObj.append("status", formData.status)
        formDataObj.append("priority", formData.priority)
        formDataObj.append("assigneeId", formData.assigneeId)
        formDataObj.append("dueDate", formData.dueDate)

        await updateTask(task.id, formDataObj)
      }

      // Update local state
      const updatedTask: Task = {
        ...task,
        title: formData.title,
        description: formData.description,
        status: formData.status as "todo" | "in-progress" | "done",
        priority: formData.priority as "low" | "medium" | "high",
        assignee_id: formData.assigneeId !== "none" ? Number.parseInt(formData.assigneeId) : undefined,
        due_date: formData.dueDate || undefined,
        assignee:
          formData.assigneeId !== "none" ? users.find((u) => u.id === Number.parseInt(formData.assigneeId)) : undefined,
        updated_at: new Date().toISOString(),
      }

      onUpdate(updatedTask)
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating task:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return

    setLoading(true)

    try {
      if (dbConnected) {
        await deleteTask(task.id)
      }

      onDelete(task.id)
      onClose()
    } catch (error) {
      console.error("Error deleting task:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim() || !currentUser) return

    try {
      if (dbConnected) {
        const result = await addComment(task.id, newComment, currentUser)
        if (result.success && result.comment) {
          setComments((prev) => [...prev, result.comment])
        }
      } else {
        // Demo mode - simulate adding comment with current user
        const newCommentObj: Comment = {
          id: Date.now(),
          content: newComment,
          task_id: task.id,
          author_id: currentUser.id,
          created_at: new Date().toISOString(),
          author: currentUser,
        }

        setComments((prev) => [...prev, newCommentObj])
      }

      setNewComment("")
    } catch (error) {
      console.error("Error adding comment:", error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const priorityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">{isEditing ? "Edit Task" : task.title}</DialogTitle>
            <div className="flex items-center space-x-2">
              {!isEditing && (
                <Button variant="ghost" size="icon" onClick={handleEdit}>
                  <Edit className="w-4 h-4" />
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={handleDelete} disabled={loading}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Priority</label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Assignee</label>
                  <Select value={formData.assigneeId} onValueChange={(value) => handleInputChange("assigneeId", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No assignee</SelectItem>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Due Date</label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange("dueDate", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          ) : (
            <>
              {/* Task Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <p className="mt-1 capitalize">{task.status.replace("-", " ")}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Priority</label>
                  <Badge className={`mt-1 ${priorityColors[task.priority]}`}>{task.priority}</Badge>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Assignee</label>
                  <div className="flex items-center space-x-2 mt-1">
                    {task.assignee ? (
                      <>
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={task.assignee.avatar_url || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">
                            {task.assignee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{task.assignee.name}</span>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">No assignee</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Due Date</label>
                  <div className="flex items-center space-x-1 mt-1">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">
                      {task.due_date ? new Date(task.due_date).toLocaleDateString() : "No due date"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              {task.description && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-sm text-gray-600">{task.description}</p>
                </div>
              )}
            </>
          )}

          {/* Comments Section */}
          {!isEditing && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <MessageCircle className="w-4 h-4 mr-2" />
                Comments ({comments.length})
              </h4>

              <div className="space-y-3 mb-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={comment.author?.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">
                        {comment.author?.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("") || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{comment.author?.name}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Comment */}
              <div className="flex space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={currentUser?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs">
                    {currentUser?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("") || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 flex space-x-2">
                  <Input
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
                  />
                  <Button size="icon" onClick={handleAddComment}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
