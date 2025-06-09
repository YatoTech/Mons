"use client"

import { useState, useEffect } from "react"
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Bell, Users, HelpCircle } from "lucide-react"
import { KanbanColumn } from "@/components/kanban-column"
import { TaskCard } from "@/components/task-card"
import { TaskDetailModal } from "@/components/task-detail-modal"
import { AddTaskModal } from "@/components/add-task-modal"
import { TeamModal } from "@/components/team-modal"
import { getTasks, getUsers, updateTaskStatus } from "@/lib/actions"
import type { Task, User } from "@/lib/types"
import { SettingsModal } from "@/components/settings-modal"
import { ProfileModal } from "@/components/profile-modal"
import { AccountDropdown } from "@/components/account-dropdown"
import { useAuth } from "@/lib/auth"
import { HelpModal } from "@/components/help-modal"
import { BackupModal } from "@/components/backup-modal"

// Onboarding tasks untuk user baru
const getOnboardingTasks = (currentUser: User | null): Task[] => [
  // TO DO Tasks
  {
    id: 1,
    title: "Complete Profile Verification",
    description:
      "Add your profile picture, phone number, location, and bio to complete your profile setup. This helps personalize your workspace experience.",
    status: "todo",
    priority: "high",
    project_id: 1,
    assignee_id: currentUser?.id,
    due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 3 days from now
    created_by: currentUser?.id || 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    assignee: currentUser,
    comments: [],
    attachments: [],
  },
  {
    id: 2,
    title: "Configure Data Backup Settings",
    description:
      "Set up automatic backup for your tasks and data. Choose between Google Drive sync or local backup to ensure your work is always safe.",
    status: "todo",
    priority: "high",
    project_id: 1,
    assignee_id: currentUser?.id,
    due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 2 days from now
    created_by: currentUser?.id || 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    assignee: currentUser,
    comments: [],
    attachments: [],
  },
  {
    id: 3,
    title: "Set Up Notification Preferences",
    description:
      "Customize your notification settings to stay updated on task deadlines, comments, and project updates without being overwhelmed.",
    status: "todo",
    priority: "medium",
    project_id: 1,
    assignee_id: currentUser?.id,
    due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 5 days from now
    created_by: currentUser?.id || 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    assignee: currentUser,
    comments: [],
    attachments: [],
  },
  {
    id: 4,
    title: "Create Your First Personal Project",
    description:
      "Start organizing your work by creating your first project. You can use it for personal goals, work tasks, or hobby projects.",
    status: "todo",
    priority: "medium",
    project_id: 1,
    assignee_id: currentUser?.id,
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 1 week from now
    created_by: currentUser?.id || 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    assignee: currentUser,
    comments: [],
    attachments: [],
  },
  // IN PROGRESS Task
  {
    id: 5,
    title: "Learn Application Features",
    description:
      "Explore the help guide to understand drag & drop functionality, task management, comments, file attachments, and keyboard shortcuts.",
    status: "in-progress",
    priority: "medium",
    project_id: 1,
    assignee_id: currentUser?.id,
    due_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 4 days from now
    created_by: currentUser?.id || 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    assignee: currentUser,
    comments: [
      {
        id: 1,
        content: "Started reading the user guide. The drag & drop feature looks really intuitive!",
        task_id: 5,
        author_id: currentUser?.id || 1,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        author: currentUser,
      },
    ],
    attachments: [],
  },
  // DONE Task
  {
    id: 6,
    title: "Welcome to Mons📋",
    description:
      "Congratulations! You've successfully created your account and logged into Mons📋. This task management system will help you stay organized and productive.",
    status: "done",
    priority: "low",
    project_id: 1,
    assignee_id: currentUser?.id,
    due_date: undefined,
    created_by: currentUser?.id || 1,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    updated_at: new Date().toISOString(),
    assignee: currentUser,
    comments: [
      {
        id: 2,
        content: "Welcome to your personal workspace! 🎉",
        task_id: 6,
        author_id: currentUser?.id || 1,
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        author: currentUser,
      },
    ],
    attachments: [],
  },
]

export default function Component() {
  const { user: currentUser } = useAuth()

  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false)
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false)
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [dbStatus, setDbStatus] = useState<"connected" | "disconnected" | "loading">("loading")
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const projectId = 1

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    const activeTask = tasks.find((task) => task.id.toString() === event.active.id)
    setActiveTask(activeTask || null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    const taskId = Number.parseInt(active.id as string)
    const newStatus = over.id as "todo" | "in-progress" | "done"

    // Optimistic update
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))

    try {
      if (dbStatus === "connected") {
        await updateTaskStatus(taskId, newStatus)
      }
    } catch (error) {
      console.error("Error updating task status:", error)
    }

    setActiveTask(null)
  }

  useEffect(() => {
    if (currentUser) {
      setUsers([currentUser])
      setTasks(getOnboardingTasks(currentUser))
    }
    loadData()

    const timeout = setTimeout(() => {
      if (loading) {
        setLoading(false)
        setDbStatus("disconnected")
      }
    }, 2000)

    return () => clearTimeout(timeout)
  }, [currentUser])

  const loadData = async () => {
    try {
      const [tasksData, usersData] = await Promise.all([getTasks(projectId), getUsers()])

      if (tasksData.length > 0) {
        setTasks(tasksData)
        setDbStatus("connected")
      } else {
        setTasks(getOnboardingTasks(currentUser))
        setDbStatus("disconnected")
      }

      if (currentUser) {
        setUsers([currentUser])
      }
    } catch (error) {
      console.error("Error loading data:", error)
      setTasks(getOnboardingTasks(currentUser))
      if (currentUser) {
        setUsers([currentUser])
      }
      setDbStatus("disconnected")
    } finally {
      setLoading(false)
    }
  }

  const handleAddTask = (newTaskData: any) => {
    const newTask: Task = {
      id: Date.now(),
      title: newTaskData.title,
      description: newTaskData.description || "",
      status: newTaskData.status || "todo",
      priority: newTaskData.priority || "medium",
      project_id: projectId,
      assignee_id: newTaskData.assigneeId !== "none" ? currentUser?.id : undefined,
      due_date: newTaskData.dueDate || undefined,
      created_by: currentUser?.id || 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      assignee: newTaskData.assigneeId !== "none" ? currentUser : undefined,
      comments: [],
      attachments: [],
    }

    setTasks((prev) => [...prev, newTask])
  }

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)))

    if (selectedTask && selectedTask.id === updatedTask.id) {
      setSelectedTask(updatedTask)
    }
  }

  const handleDeleteTask = (taskId: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))

    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(null)
    }
  }

  const handleUpdateUser = (updatedUser: User) => {
    setUsers([updatedUser])
  }

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const todoTasks = filteredTasks.filter((task) => task.status === "todo")
  const inProgressTasks = filteredTasks.filter((task) => task.status === "in-progress")
  const doneTasks = filteredTasks.filter((task) => task.status === "done")

  // Calculate completion percentage
  const totalTasks = tasks.length
  const completedTasks = doneTasks.length
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Mons📋...</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Mons📋</h1>
              <Badge variant="secondary">Getting Started</Badge>
              {dbStatus === "disconnected" && (
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  Demo Mode
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>

              <Button variant="ghost" size="icon" onClick={() => setIsHelpModalOpen(true)}>
                <HelpCircle className="w-5 h-5" />
              </Button>

              <Button variant="ghost" size="icon" onClick={() => setIsTeamModalOpen(true)}>
                <Users className="w-5 h-5" />
              </Button>

              <AccountDropdown
                user={currentUser}
                onOpenSettings={() => setIsSettingsOpen(true)}
                onOpenProfile={() => {
                  setSelectedUser(currentUser)
                  setIsProfileOpen(true)
                }}
                onOpenBackup={() => setIsBackupModalOpen(true)}
              />

              <Avatar className="w-8 h-8 border-2 border-white">
                <AvatarImage src={currentUser.avatar_url || "/placeholder.svg"} />
                <AvatarFallback>
                  {currentUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome to Mons📋, {currentUser.name}! 👋</h2>
              <p className="text-blue-100 mb-4">
                Let's get you set up for success. Complete the onboarding tasks below to unlock the full potential of
                your workspace.
              </p>
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 rounded-full px-3 py-1">
                  <span className="text-sm font-medium">Progress: {completionPercentage}%</span>
                </div>
                <div className="w-32 bg-white/20 rounded-full h-2">
                  <div
                    className="bg-white rounded-full h-2 transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="text-6xl opacity-20">🚀</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Getting Started Tasks</h2>
            <p className="text-gray-600 mt-1">
              Complete these tasks to set up your workspace and learn how to use Mons📋 effectively
            </p>
          </div>
          <Button onClick={() => setIsAddTaskOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>

        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <KanbanColumn id="todo" title="To Do" count={todoTasks.length} color="bg-red-50 border border-red-200">
              <SortableContext items={todoTasks.map((t) => t.id.toString())} strategy={verticalListSortingStrategy}>
                {todoTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onClick={() => setSelectedTask(task)} />
                ))}
              </SortableContext>
            </KanbanColumn>

            <KanbanColumn
              id="in-progress"
              title="In Progress"
              count={inProgressTasks.length}
              color="bg-yellow-50 border border-yellow-200"
            >
              <SortableContext
                items={inProgressTasks.map((t) => t.id.toString())}
                strategy={verticalListSortingStrategy}
              >
                {inProgressTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onClick={() => setSelectedTask(task)} />
                ))}
              </SortableContext>
            </KanbanColumn>

            <KanbanColumn id="done" title="Done" count={doneTasks.length} color="bg-green-50 border border-green-200">
              <SortableContext items={doneTasks.map((t) => t.id.toString())} strategy={verticalListSortingStrategy}>
                {doneTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onClick={() => setSelectedTask(task)} />
                ))}
              </SortableContext>
            </KanbanColumn>
          </div>

          <DragOverlay>{activeTask ? <TaskCard task={activeTask} isDragging /> : null}</DragOverlay>
        </DndContext>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setIsProfileOpen(true)}
            className="p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-lg">👤</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Complete Profile</h3>
                <p className="text-sm text-gray-600">Add your details and photo</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setIsBackupModalOpen(true)}
            className="p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-lg">☁️</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Setup Backup</h3>
                <p className="text-sm text-gray-600">Secure your data</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setIsHelpModalOpen(true)}
            className="p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-lg">📚</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Learn Features</h3>
                <p className="text-sm text-gray-600">Get help and tips</p>
              </div>
            </div>
          </button>
        </div>
      </main>

      {/* Modals */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
        users={users}
        dbConnected={dbStatus === "connected"}
      />

      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onAdd={handleAddTask}
        users={users}
        projectId={projectId}
        dbConnected={dbStatus === "connected"}
      />

      <TeamModal isOpen={isTeamModalOpen} onClose={() => setIsTeamModalOpen(false)} users={users} />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentUser={currentUser}
        onUpdateUser={handleUpdateUser}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={selectedUser || currentUser}
        tasks={tasks}
      />

      <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />

      <BackupModal isOpen={isBackupModalOpen} onClose={() => setIsBackupModalOpen(false)} currentUser={currentUser} />
    </div>
  )
}
