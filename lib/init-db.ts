import { sql } from "./db"

export async function initializeDatabase() {
  try {
    // Simple connection test first
    console.log("Testing database connection...")

    // Test if we can execute a simple query
    await sql`SELECT 1 as test`
    console.log("Database connection successful")

    // Check if tables exist, if not create them
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        avatar_url VARCHAR(255),
        role VARCHAR(50) NOT NULL DEFAULT 'member',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS project_members (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(50) NOT NULL DEFAULT 'member',
        UNIQUE(project_id, user_id)
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) NOT NULL DEFAULT 'todo',
        priority VARCHAR(50) NOT NULL DEFAULT 'medium',
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        assignee_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        due_date DATE,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
        author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS attachments (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        file_url VARCHAR(255) NOT NULL,
        file_type VARCHAR(100),
        file_size INTEGER,
        task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
        uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Check if we have any users, if not, seed with initial data
    const userCount = await sql`SELECT COUNT(*) as count FROM users`

    if (userCount[0].count === 0) {
      await seedInitialData()
    }

    console.log("Database initialized successfully")
    return true
  } catch (error) {
    console.error("Database initialization failed:", error)
    return false
  }
}

async function seedInitialData() {
  try {
    console.log("Seeding initial data...")

    // Insert sample users
    await sql`
      INSERT INTO users (name, email, avatar_url, role) VALUES
      ('Alice Johnson', 'alice@example.com', NULL, 'admin'),
      ('Bob Smith', 'bob@example.com', NULL, 'member'),
      ('Carol Davis', 'carol@example.com', NULL, 'member'),
      ('David Wilson', 'david@example.com', NULL, 'member')
    `

    // Insert sample project
    await sql`
      INSERT INTO projects (name, description, created_by) VALUES
      ('Project Alpha', 'Main development project for the new application', 1)
    `

    // Insert project members
    await sql`
      INSERT INTO project_members (project_id, user_id, role) VALUES
      (1, 1, 'admin'),
      (1, 2, 'member'),
      (1, 3, 'member'),
      (1, 4, 'member')
    `

    // Insert sample tasks
    await sql`
      INSERT INTO tasks (title, description, status, priority, project_id, assignee_id, due_date, created_by) VALUES
      ('Design System Setup', 'Create a comprehensive design system for the project', 'todo', 'high', 1, 1, '2024-01-15', 1),
      ('API Integration', 'Integrate with third-party APIs for data synchronization', 'in-progress', 'medium', 1, 2, '2024-01-20', 1),
      ('User Authentication', 'Implement secure user authentication system', 'done', 'high', 1, 3, NULL, 1),
      ('Database Migration', 'Set up and migrate database schema', 'todo', 'medium', 1, 4, '2024-01-18', 1),
      ('Frontend Components', 'Build reusable React components', 'in-progress', 'low', 1, 2, '2024-01-25', 1)
    `

    // Insert sample comments
    await sql`
      INSERT INTO comments (content, task_id, author_id) VALUES
      ('Started working on the color palette and typography', 1, 1),
      ('Authentication system is complete and tested', 3, 3),
      ('Need to review the API documentation first', 2, 2),
      ('Database schema looks good, ready to proceed', 4, 4)
    `

    console.log("Database seeded with initial data successfully")
  } catch (error) {
    console.error("Error seeding database:", error)
    throw error
  }
}
