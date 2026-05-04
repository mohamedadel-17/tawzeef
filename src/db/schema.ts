import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// users table
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  companyName: text("company_name"),
  role: text("role").$type<"admin" | "user">().default("user"),
});

// jobs table
export const jobs = sqliteTable("jobs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  companyName: text("company_name").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements").notNull(),
  location: text("location").default("Remote"),
  salary: text("salary"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});

// applications table
export const applications = sqliteTable("applications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  jobId: integer("job_id").references(() => jobs.id),
  status: text("status")
    .$type<"Under Review" | "Accepted" | "Rejected">()
    .default("Under Review"),
  aiScore: integer("ai_score"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});
