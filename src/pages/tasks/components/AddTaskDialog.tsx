import { useState } from "react"
import { useForm } from "react-hook-form"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createTask } from "@/services/apiTasks"
import { getContacts } from "@/services/apiContacts"
import { getDeals } from "@/services/apiDeals"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog"
import { Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface AddTaskDialogProps {
    defaultContactId?: string
    defaultDealId?: string
    trigger?: React.ReactNode
}

export function AddTaskDialog({ defaultContactId, defaultDealId, trigger }: AddTaskDialogProps) {
    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()
    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            contact_id: defaultContactId || "",
            deal_id: defaultDealId || "",
            title: "",
            due_date: "",
            description: ""
        }
    })

    const { data: contacts } = useQuery({ queryKey: ["contacts"], queryFn: getContacts })
    const { data: deals } = useQuery({ queryKey: ["deals"], queryFn: getDeals })

    const mutation = useMutation({
        mutationFn: createTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] })
            if (defaultContactId) queryClient.invalidateQueries({ queryKey: ["contact", defaultContactId] })
            setOpen(false)
            reset()
            toast.success("Task created successfully")
        },
        onError: (error) => {
            console.error("Failed to create task:", error)
            toast.error("Failed to create task", {
                description: error.message
            })
        }
    })

    const onSubmit = (data: any) => {
        mutation.mutate({
            ...data,
            completed: false,
            // Ensure empty strings are treated as null/undefined if backend requires, 
            // or just pass them. Supabase usually creates FK violation if empty string is passed to UUID.
            contact_id: data.contact_id || null,
            deal_id: data.deal_id || null
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Task
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>New Task</DialogTitle>
                    <DialogDescription>
                        Add a new task to your list.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input {...register("title", { required: true })} placeholder="Follow up with client..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Due Date</Label>
                            <Input type="date" {...register("due_date")} />
                        </div>
                        <div className="space-y-2">
                            <Label>Related Contact</Label>
                            <select
                                {...register("contact_id")}
                                defaultValue={defaultContactId}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="">None</option>
                                {contacts?.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Related Deal</Label>
                        <select
                            {...register("deal_id")}
                            defaultValue={defaultDealId}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="">None</option>
                            {deals?.filter(d => d.stage !== 'Closed').map(d => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <textarea
                            {...register("description")}
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Add more details..."
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Task
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
