"use server"

import { sql } from "./db"
import { initializeDatabase } from "./init-db"
import type { Task, User, Comment } from "./types"
import { revalidatePath } from "next/cache"

// Fallback data - only unassigned tasks
const fallbackTasks = [
  {
    id: 1,
    title: "Design System Setup",
    description: "Create a comprehensive design system for the project",
    status: "todo",
    priority: "high",
    project_id: 1,
    assignee_id: null,
    due_date: "2024-01-15",
    created_by: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    assignee_name: null,
    assignee_email: null,
    assignee_avatar: null,
    assignee_role: null,
  },
  {
    id: 2,
    title: "API Integration",
    description: "Integrate with third-party APIs for data synchronization",
    status: "in-progress",
    priority: "medium",
    project_id: 1,
    assignee_id: null,
    due_date: "2024-01-20",
    created_by: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    assignee_name: null,
    assignee_email: null,
    assignee_avatar: null,
    assignee_role: null,
  },
  {
    id: 3,
    title: "User Authentication",
    description: "Implement secure user authentication system",
    status: "done",
    priority: "high",
    project_id: 1,
    assignee_id: null,
    due_date: null,
    created_by: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    assignee_name: null,
    assignee_email: null,
    assignee_avatar: null,
    assignee_role: null,
  },
]

export async function getTasks(projectId: number) {
  try {
    const dbInitialized = await initializeDatabase()

    if (!dbInitialized) {
      console.log("Database not initialized, using fallback data")
      return fallbackTasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status as "todo" | "in-progress" | "done",
        priority: task.priority as "low" | "medium" | "high",
        project_id: task.project_id,
        assignee_id: task.assignee_id,
        due_date: task.due_date,
        created_by: task.created_by,
        created_at: task.created_at,
        updated_at: task.updated_at,
        assignee: undefined, // No assignee
        comments: [],
        attachments: [],
      })) as Task[]
    }

    const tasks = await sql`
      SELECT 
        t.*,
        u.name as assignee_name,
        u.email as assignee_email,
        u.avatar_url as assignee_avatar,
        u.role as assignee_role
      FROM tasks t
      LEFT JOIN users u ON t.assignee_id = u.id
      WHERE t.project_id = ${projectId}
      ORDER BY t.created_at DESC
    `

    return tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      project_id: task.project_id,
      assignee_id: task.assignee_id,
      due_date: task.due_date,
      created_by: task.created_by,
      created_at: task.created_at,
      updated_at: task.updated_at,
      assignee: task.assignee_id
        ? {
            id: task.assignee_id,
            name: task.assignee_name,
            email: task.assignee_email,
            avatar_url: task.assignee_avatar,
            role: task.assignee_role,
            created_at: "",
          }
        : undefined,
      comments: [],
      attachments: [],
    })) as Task[]
  } catch (error) {
    console.error("Database error:", error)
    return fallbackTasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status as "todo" | "in-progress" | "done",
      priority: task.priority as "low" | "medium" | "high",
      project_id: task.project_id,
      assignee_id: task.assignee_id,
      due_date: task.due_date,
      created_by: task.created_by,
      created_at: task.created_at,
      updated_at: task.updated_at,
      assignee: undefined,
      comments: [],
      attachments: [],
    })) as Task[]
  }
}

export async function createTask(formData: FormData) {
  try {
    const dbInitialized = await initializeDatabase()

    if (!dbInitialized) {
      console.log("Database not available, simulating task creation")
      return { success: true, taskId: Math.floor(Math.random() * 1000) }
    }

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const status = formData.get("status") as string
    const priority = formData.get("priority") as string
    const projectId = Number.parseInt(formData.get("projectId") as string)
    const assigneeId = formData.get("assigneeId") as string
    const dueDate = formData.get("dueDate") as string
    const createdBy = Number.parseInt(formData.get("createdBy") as string) || 1

    const result = await sql`
      INSERT INTO tasks (title, description, status, priority, project_id, assignee_id, due_date, created_by)
      VALUES (
        ${title}, 
        ${description}, 
        ${status}, 
        ${priority}, 
        ${projectId}, 
        ${assigneeId === "none" ? null : Number.parseInt(assigneeId)}, 
        ${dueDate || null}, 
        ${createdBy}
      )
      RETURNING id
    `

    revalidatePath("/")
    return { success: true, taskId: result[0].id }
  } catch (error) {
    console.error("Error creating task:", error)
    return { success: false, error: "Failed to create task" }
  }
}

export async function updateTaskStatus(taskId: number, status: string) {
  try {
    const dbInitialized = await initializeDatabase()

    if (!dbInitialized) {
      console.log("Database not available, simulating status update")
      return { success: true }
    }

    await sql`
      UPDATE tasks 
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${taskId}
    `

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error updating task status:", error)
    return { success: false }
  }
}

export async function updateTask(taskId: number, formData: FormData) {
  try {
    const dbInitialized = await initializeDatabase()

    if (!dbInitialized) {
      console.log("Database not available, simulating task update")
      return { success: true }
    }

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const status = formData.get("status") as string
    const priority = formData.get("priority") as string
    const assigneeId = formData.get("assigneeId") as string
    const dueDate = formData.get("dueDate") as string

    await sql`
      UPDATE tasks 
      SET 
        title = ${title},
        description = ${description},
        status = ${status},
        priority = ${priority},
        assignee_id = ${assigneeId === "none" ? null : Number.parseInt(assigneeId)},
        due_date = ${dueDate || null},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${taskId}
    `

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error updating task:", error)
    return { success: false }
  }
}

export async function deleteTask(taskId: number) {
  try {
    const dbInitialized = await initializeDatabase()

    if (!dbInitialized) {
      console.log("Database not available, simulating task deletion")
      return { success: true }
    }

    await sql`DELETE FROM tasks WHERE id = ${taskId}`

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error deleting task:", error)
    return { success: false }
  }
}

// Return empty users array - only current user will be used from auth context
export async function getUsers() {
  return [] as User[]
}

export async function addComment(taskId: number, content: string, currentUser: User) {
  try {
    const dbInitialized = await initializeDatabase()

    if (!dbInitialized) {
      console.log("Database not available, simulating comment addition")
      const newComment: Comment = {
        id: Math.floor(Math.random() * 1000),
        content,
        task_id: taskId,
        author_id: currentUser.id,
        created_at: new Date().toISOString(),
        author: currentUser,
      }
      return {
        success: true,
        commentId: newComment.id,
        comment: newComment,
      }
    }

    const result = await sql`
      INSERT INTO comments (content, task_id, author_id)
      VALUES (${content}, ${taskId}, ${currentUser.id})
      RETURNING id
    `

    const newComment: Comment = {
      id: result[0].id,
      content,
      task_id: taskId,
      author_id: currentUser.id,
      created_at: new Date().toISOString(),
      author: currentUser,
    }

    revalidatePath("/")
    return {
      success: true,
      commentId: result[0].id,
      comment: newComment,
    }
  } catch (error) {
    console.error("Error adding comment:", error)
    return { success: false }
  }
}

export async function getTaskComments(taskId: number) {
  try {
    const dbInitialized = await initializeDatabase()

    if (!dbInitialized) {
      console.log("Database not available, returning empty comments")
      return []
    }

    const comments = await sql`
      SELECT 
        c.*,
        u.name as author_name,
        u.email as author_email,
        u.avatar_url as author_avatar
      FROM comments c
      JOIN users u ON c.author_id = u.id
      WHERE c.task_id = ${taskId}
      ORDER BY c.created_at ASC
    `

    return comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      task_id: comment.task_id,
      author_id: comment.author_id,
      created_at: comment.created_at,
      author: {
        id: comment.author_id,
        name: comment.author_name,
        email: comment.author_email,
        avatar_url: comment.author_avatar,
        role: "member" as const,
        created_at: "",
      },
    })) as Comment[]
  } catch (error) {
    console.error("Error fetching comments:", error)
    return []
  }
}
