import { useParams, useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getContact, updateContact, deleteContact } from "@/services/apiContacts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Loader2, Save, Trash } from "lucide-react"
import { useForm } from "react-hook-form"
import { useEffect } from "react"

export default function ContactDetail() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const { data: contact, isLoading } = useQuery({
        queryKey: ["contact", id],
        queryFn: () => getContact(id!),
        enabled: !!id,
    })

    const { register, handleSubmit, reset, formState: { isDirty } } = useForm()

    useEffect(() => {
        if (contact) {
            reset({
                name: contact.name,
                email: contact.email,
                phone: contact.phone,
                company: contact.company,
                notes: contact.notes,
                tags: contact.tags ? contact.tags.join(", ") : "",
            })
        }
    }, [contact, reset])

    const updateMutation = useMutation({
        mutationFn: (updates: any) => updateContact({ id: id!, updates }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contact", id] })
            queryClient.invalidateQueries({ queryKey: ["contacts"] })
        },
    })

    const deleteMutation = useMutation({
        mutationFn: () => deleteContact(id!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contacts"] })
            navigate("/contacts")
        },
    })

    if (isLoading) {
        return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>
    }

    if (!contact) {
        return <div>Contact not found</div>
    }

    const onSubmit = (data: any) => {
        const payload = {
            ...data,
            tags: typeof data.tags === 'string' ? data.tags.split(",").map((t: string) => t.trim()).filter((t: string) => t.length > 0) : data.tags
        }
        updateMutation.mutate(payload)
    }

    const getInitials = (name: string) => name ? name.substring(0, 2).toUpperCase() : "??"

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/contacts")}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                        <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-2xl font-bold">{contact.name}</h1>
                        <p className="text-muted-foreground">{contact.company || "Contact"}</p>
                        {contact.tags && contact.tags.length > 0 && (
                            <div className="flex gap-2 mt-1">
                                {contact.tags.map(tag => (
                                    <span key={tag} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="ml-auto flex space-x-2">
                    <Button variant="destructive" size="icon" onClick={() => {
                        if (confirm("Are you sure?")) deleteMutation.mutate()
                    }}>
                        <Trash className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Name</Label>
                                        <Input {...register("name")} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Company</Label>
                                        <Input {...register("company")} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input {...register("email")} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Phone</Label>
                                        <Input {...register("phone")} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Tags</Label>
                                    <Input {...register("tags")} placeholder="Tag1, Tag2" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Notes</Label>
                                    <Textarea className="min-h-[100px]" {...register("notes")} />
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={!isDirty || updateMutation.isPending}>
                                        {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        <Save className="mr-2 h-4 w-4" /> Save Changes
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    {/* Sidebar for deals/tasks or activity - Placeholder for now */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-sm">No recent activity.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
