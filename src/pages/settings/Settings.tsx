import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

const profileSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email().optional(), // Email is read-only for MVP usually or handled separately
})

const passwordSchema = z.object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

export default function Settings() {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const profileForm = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: user?.user_metadata?.full_name || "",
            email: user?.email || "",
        },
    })

    const passwordForm = useForm({
        resolver: zodResolver(passwordSchema),
    })

    const onUpdateProfile = async (data: any) => {
        setLoading(true)
        setMsg(null)
        try {
            const { error } = await supabase.auth.updateUser({
                data: { full_name: data.fullName }
            })

            if (error) throw error
            setMsg({ type: 'success', text: 'Profile updated successfully' })
        } catch (error: any) {
            setMsg({ type: 'error', text: error.message })
        } finally {
            setLoading(false)
        }
    }

    const onUpdatePassword = async (data: any) => {
        setLoading(true)
        setMsg(null)
        try {
            const { error } = await supabase.auth.updateUser({
                password: data.password
            })

            if (error) throw error
            setMsg({ type: 'success', text: 'Password updated successfully' })
            passwordForm.reset()
        } catch (error: any) {
            setMsg({ type: 'error', text: error.message })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h3 className="text-2xl font-medium">Settings</h3>
                <p className="text-sm text-muted-foreground">Manage your account settings and preferences.</p>
            </div>

            {msg && (
                <div className={`p-4 rounded-md ${msg.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {msg.text}
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Update your personal information.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" {...profileForm.register("fullName")} />
                            {profileForm.formState.errors.fullName && (
                                <p className="text-xs text-red-500">{profileForm.formState.errors.fullName.message as string}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" {...profileForm.register("email")} disabled />
                        </div>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>Change your password.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={passwordForm.handleSubmit(onUpdatePassword)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input id="password" type="password" {...passwordForm.register("password")} />
                            {passwordForm.formState.errors.password && (
                                <p className="text-xs text-red-500">{passwordForm.formState.errors.password.message as string}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input id="confirmPassword" type="password" {...passwordForm.register("confirmPassword")} />
                            {passwordForm.formState.errors.confirmPassword && (
                                <p className="text-xs text-red-500">{passwordForm.formState.errors.confirmPassword.message as string}</p>
                            )}
                        </div>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Password
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="border-destructive/50">
                <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>Irreversible actions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="destructive" disabled>Delete Account (Coming Soon)</Button>
                </CardContent>
            </Card>
        </div>
    )
}
