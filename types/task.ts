export interface Task {
  id: string
  personSlug: string
  title: string
  dueDate: string
  status: "open" | "done"
  priority: "low" | "medium" | "high"
}