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
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog"
import { Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface AddDealDialogProps {
    defaultContactId?: string
    trigger?: React.ReactNode
}

export function AddDealDialog({ defaultContactId, trigger }: AddDealDialogProps) {
    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()
    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            name: "",
            value: 0,
            stage: "Lead",
            contact_id: defaultContactId || "",
            expected_close_date: "",
            notes: ""
        }
    })

    const { data: contacts } = useQuery({ queryKey: ["contacts"], queryFn: getContacts })

    const mutation = useMutation({
        mutationFn: createDeal,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["deals"] })
            if (defaultContactId) queryClient.invalidateQueries({ queryKey: ["contact", defaultContactId] })
            setOpen(false)
            reset()
            toast.success("Deal created successfully")
        },
        onError: (error) => {
            console.error("Failed to create deal:", error)
            toast.error("Failed to create deal", {
                description: error.message
            })
        }
    })

    const onSubmit = (data: any) => {
        mutation.mutate({
            ...data,
            value: Number(data.value),
            expected_close_date: data.expected_close_date || null,
            contact_id: data.contact_id === "" ? null : data.contact_id
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Deal
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Deal</DialogTitle>
                    <DialogDescription>
                        Create a new deal to track sales opportunities.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Deal Name</Label>
                        <Input {...register("name", { required: true })} placeholder="e.g. Website Redesign" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Value ($)</Label>
                            <Input type="number" {...register("value")} placeholder="0.00" />
                        </div>
                        <div className="space-y-2">
                            <Label>Expected Close Date</Label>
                            <Input type="date" {...register("expected_close_date")} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Stage</Label>
                            <select
                                {...register("stage")}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="Lead">Lead</option>
                                <option value="Qualified">Qualified</option>
                                <option value="Proposal">Proposal</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Contact</Label>
                            <select
                                {...register("contact_id")}
                                defaultValue={defaultContactId}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="">Select a contact...</option>
                                {contacts?.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Notes</Label>
                        <textarea
                            {...register("notes")}
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Add details about the deal..."
                        />
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
