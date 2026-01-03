import { supabase } from "@/lib/supabase"
import type { Task } from "@/types"

export async function getTasks() {
    const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("completed", { ascending: true }) // Incomplete first
        .order("due_date", { ascending: true })

    if (error) throw error
    return data as Task[]
}

export async function createTask(task: Partial<Task>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("User not authenticated")

    const { data, error } = await supabase
        .from("tasks")
        .insert([{ ...task, user_id: user.id }])
        .select()
        .single()

    if (error) throw error
    return data as Task
}

export async function updateTask({ id, updates }: { id: string; updates: Partial<Task> }) {
    const { data, error } = await supabase
        .from("tasks")
        .update(updates)
        .eq("id", id)
        .select()
        .single()

    if (error) throw error
    return data as Task
}

export async function deleteTask(id: string) {
    const { error } = await supabase.from("tasks").delete().eq("id", id)
    if (error) throw error
}
