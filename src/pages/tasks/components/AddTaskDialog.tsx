import { useState } from "react"
import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createTask } from "@/services/apiTasks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import { Plus, Loader2 } from "lucide-react"

export function AddTaskDialog() {
    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()
    const { register, handleSubmit, reset } = useForm()

    const mutation = useMutation({
        mutationFn: createTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] })
            setOpen(false)
            reset()
        },
    })

    const onSubmit = (data: any) => {
        mutation.mutate({
            ...data,
            completed: false
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Task
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Task</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input {...register("title", { required: true })} placeholder="Follow up with client..." />
                    </div>
                    <div className="space-y-2">
                        <Label>Due Date</Label>
                        <Input type="date" {...register("due_date")} />
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
