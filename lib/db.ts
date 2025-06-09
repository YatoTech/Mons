import { neon } from "@neondatabase/serverless"

// Cek semua kemungkinan environment variable untuk database URL
const databaseUrl =
  process.env.NEON_DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.NEON_DATABASE_URL ||
  process.env.NEON_POSTGRES_URL

let sql: any

if (databaseUrl) {
  console.log("Database URL found, initializing connection")
  try {
    sql = neon(databaseUrl)
  } catch (error) {
    console.error("Error initializing database connection:", error)
    sql = mockSql
  }
} else {
  console.log("No database URL found, using mock SQL")
  sql = mockSql
}

// Mock SQL function that throws error to trigger fallback
function mockSql() {
  throw new Error("Database not configured")
}

export { sql }
