export interface User {
    id: string
    email: string
    name: string
    timezone: string
    dark_mode: boolean
    created_at: string
    updated_at: string
}

export interface Contact {
    id: string
    user_id: string
    name: string
    email?: string
    phone?: string
    company?: string
    notes?: string
    tags?: string[]
    created_at: string
    updated_at: string
    last_activity: string
}

// Placeholder for future phases
export interface Deal {
    id: string
    contact_id?: string
    name: string
    value: number
    stage: string
    status: string
    expected_close_date?: string
}

export interface Task {
    id: string
    title: string
    completed: boolean
    due_date?: string
}
