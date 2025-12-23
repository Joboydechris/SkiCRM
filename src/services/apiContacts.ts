import { supabase } from "@/lib/supabase"
import type { Contact } from "@/types"

export async function getContact(id: string) {
    const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .eq("id", id)
        .single()

    if (error) throw error
    return data as Contact
}

// ... existing exports ...
export async function getContacts() {
    const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false })

    if (error) throw error
    return data as Contact[]
}

export async function createContact(contact: Partial<Contact>) {
    const { data, error } = await supabase
        .from("contacts")
        .insert([contact])
        .select()
        .single()

    if (error) throw error
    return data as Contact
}

export async function updateContact({ id, updates }: { id: string; updates: Partial<Contact> }) {
    const { data, error } = await supabase
        .from("contacts")
        .update(updates)
        .eq("id", id)
        .select()
        .single()

    if (error) throw error
    return data as Contact
}

export async function deleteContact(id: string) {
    const { error } = await supabase.from("contacts").delete().eq("id", id)
    if (error) throw error
}
