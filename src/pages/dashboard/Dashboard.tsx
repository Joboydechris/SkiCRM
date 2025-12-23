import { useQuery } from "@tanstack/react-query"
import { getContacts } from "@/services/apiContacts"
import { getDeals } from "@/services/apiDeals"
import { getTasks } from "@/services/apiTasks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FolderKanban, CheckSquare, TrendingUp } from "lucide-react"
import { Link } from "react-router-dom"
import { Loader2 } from "lucide-react"

import { useAuth } from "@/contexts/AuthContext"

export default function Dashboard() {
    const { user } = useAuth()
    const { data: contacts, isLoading: loadingContacts } = useQuery({ queryKey: ["contacts"], queryFn: getContacts })
    const { data: deals, isLoading: loadingDeals } = useQuery({ queryKey: ["deals"], queryFn: getDeals })
    const { data: tasks, isLoading: loadingTasks } = useQuery({ queryKey: ["tasks"], queryFn: getTasks })

    const isLoading = loadingContacts || loadingDeals || loadingTasks

    if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>

    const totalContacts = contacts?.length || 0
    const activeDeals = deals?.filter(d => d.stage !== 'Closed').length || 0
    const totalPipelineValue = deals?.reduce((sum, d) => sum + (d.value || 0), 0) || 0
    const pendingTasks = tasks?.filter(t => !t.completed).length || 0

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return "Good morning"
        if (hour < 18) return "Good afternoon"
        return "Good evening"
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{getGreeting()}, {user?.user_metadata?.name || user?.email?.split('@')[0] || "User"}!</h1>
                <p className="text-muted-foreground">Here is an overview of your business.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Link to="/contacts">
                    <Card className="hover:bg-muted/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalContacts}</div>
                        </CardContent>
                    </Card>
                </Link>
                <Link to="/deals">
                    <Card className="hover:bg-muted/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
                            <FolderKanban className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{activeDeals}</div>
                        </CardContent>
                    </Card>
                </Link>
                <Link to="/deals">
                    <Card className="hover:bg-muted/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${totalPipelineValue.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                </Link>
                <Link to="/tasks">
                    <Card className="hover:bg-muted/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                            <CheckSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{pendingTasks}</div>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Deals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {deals?.slice(0, 5).map(deal => (
                                <div key={deal.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                    <div>
                                        <p className="font-medium">{deal.name}</p>
                                        <p className="text-sm text-muted-foreground">{deal.contacts?.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">${deal.value?.toLocaleString()}</p>
                                        <p className="text-xs text-muted-foreground">{deal.stage}</p>
                                    </div>
                                </div>
                            ))}
                            {deals?.length === 0 && <p className="text-sm text-muted-foreground">No deals found.</p>}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Upcoming Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {tasks?.filter(t => !t.completed).slice(0, 5).map(task => (
                                <div key={task.id} className="flex items-center space-x-2">
                                    <div className="h-2 w-2 rounded-full bg-primary" />
                                    <span className="text-sm font-medium leading-none">{task.title}</span>
                                    {task.due_date && <span className="ml-auto text-xs text-muted-foreground">{new Date(task.due_date).toLocaleDateString()}</span>}
                                </div>
                            ))}
                            {tasks?.filter(t => !t.completed).length === 0 && <p className="text-sm text-muted-foreground">No pending tasks.</p>}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
