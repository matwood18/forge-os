import { tasks } from "@/lib/tasks"

export function getTasks() {
  return tasks
}

export function getOpenTasks() {
  return tasks.filter((task) => task.status === "open")
}

export function getTasksForPerson(personSlug: string) {
  return tasks.filter((task) => task.personSlug === personSlug)
}