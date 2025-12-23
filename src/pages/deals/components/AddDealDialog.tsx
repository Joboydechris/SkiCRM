import { useState } from "react"
import { useForm } from "react-hook-form"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createDeal } from "@/services/apiDeals"
import { getContacts } from "@/services/apiContacts"
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

export function AddDealDialog() {
    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()
    const { register, handleSubmit, reset } = useForm()

    const { data: contacts } = useQuery({ queryKey: ["contacts"], queryFn: getContacts })

    const mutation = useMutation({
        mutationFn: createDeal,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["deals"] })
            setOpen(false)
            reset()
        },
    })

    const onSubmit = (data: any) => {
        mutation.mutate({ ...data, value: Number(data.value) })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Deal
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Deal</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Deal Name</Label>
                        <Input {...register("name", { required: true })} />
                    </div>
                    <div className="space-y-2">
                        <Label>Value</Label>
                        <Input type="number" {...register("value")} />
                    </div>
                    <div className="space-y-2">
                        <Label>Contact</Label>
                        <select
                            {...register("contact_id")}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="">Select a contact...</option>
                            {contacts?.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label>Stage</Label>
                        <select
                            {...register("stage")}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            defaultValue="Lead"
                        >
                            <option value="Lead">Lead</option>
                            <option value="Qualified">Qualified</option>
                            <option value="Proposal">Proposal</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Deal
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
