export interface User {
  id: number
  name: string
  email: string
  avatar_url?: string
  role: 'admin' | 'member'
  created_at: string
}

export interface Project {
  id: number
  name: string
  description?: string
  created_by: number
  created_at: string
}

export interface Task {
  id: number
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  project_id: number
  assignee_id?: number
  due_date?: string
  created_by: number
  created_at: string
  updated_at: string
  assignee?: User
  comments?: Comment[]
  attachments?: Attachment[]
}

export interface Comment {
  id: number
  content: string
  task_id: number
  author_id: number
  created_at: string
  author?: User
}

export interface Attachment {
  id: number
  filename: string
  file_url: string
  file_type?: string
  file_size?: number
  task_id: number
  uploaded_by: number
  created_at: string
}

export interface ProjectMember {
  id: number
  project_id: number
  user_id: number
  role: 'admin' | 'member'
  user?: User
}
