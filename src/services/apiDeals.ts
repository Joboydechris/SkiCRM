import { supabase } from "@/lib/supabase"
import type { Deal } from "@/types"

export async function getDeals() {
    const { data, error } = await supabase
        .from("deals")
        .select("*, contacts(name)")
        .order("created_at", { ascending: false })

    if (error) throw error
    return data as (Deal & { contacts: { name: string } | null })[]
}

export async function createDeal(deal: Partial<Deal>) {
    const { data, error } = await supabase
        .from("deals")
        .insert([deal])
        .select()
        .single()

    if (error) throw error
    return data as Deal
}

export async function updateDeal({ id, updates }: { id: string; updates: Partial<Deal> }) {
    const { data, error } = await supabase
        .from("deals")
        .update(updates)
        .eq("id", id)
        .select()
        .single()

    if (error) throw error
    return data as Deal
}

export async function deleteDeal(id: string) {
    const { error } = await supabase.from("deals").delete().eq("id", id)
    if (error) throw error
}
