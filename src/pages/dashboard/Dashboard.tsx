import { useQuery } from "@tanstack/react-query"
import { getContacts } from "@/services/apiContacts"
import { getDeals } from "@/services/apiDeals"
import { getTasks } from "@/services/apiTasks"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, ArrowUpRight } from "lucide-react"
import { Link } from "react-router-dom"
import { Loader2 } from "lucide-react"

export default function Dashboard() {
    const { data: contacts, isLoading: loadingContacts } = useQuery({ queryKey: ["contacts"], queryFn: getContacts })
    const { data: deals, isLoading: loadingDeals } = useQuery({ queryKey: ["deals"], queryFn: getDeals })
    const { data: tasks, isLoading: loadingTasks } = useQuery({ queryKey: ["tasks"], queryFn: getTasks })

    const isLoading = loadingContacts || loadingDeals || loadingTasks

    if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>

    const totalContacts = contacts?.length || 0
    const activeDeals = deals?.filter(d => d.stage !== 'Closed').length || 0
    const totalPipelineValue = deals?.reduce((sum, d) => sum + (d.value || 0), 0) || 0
    const pendingTasks = tasks?.filter(t => !t.completed).length || 0

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
            </div>

            {/* Top Grid: Revenue Card (Dark) + 3 Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Featured "Revenue" Card */}
                <div className="bg-gray-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl flex flex-col justify-between min-h-[160px] dark:bg-gray-800">
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
                    <div>
                        <p className="text-sm font-medium text-gray-400">Total Revenue</p>
                        <h3 className="text-3xl font-bold mt-2">${totalPipelineValue.toLocaleString()}</h3>
                    </div>
                    <div className="flex items-center text-green-400 text-sm mt-4">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span>+4.2% from last month</span>
                    </div>
                </div>

                {/* Stat 1: Contacts */}
                <Link to="/contacts" className="block">
                    <Card className="rounded-3xl border-none shadow-sm h-full hover:shadow-md transition-shadow">
                        <CardContent className="p-6 flex flex-col justify-between h-full">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Contacts</p>
                                <h3 className="text-3xl font-bold mt-2">{totalContacts}</h3>
                            </div>
                            <div className="flex items-center text-green-600 text-sm mt-4">
                                <ArrowUpRight className="h-4 w-4 mr-1" />
                                <span>12% from last month</span>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                {/* Stat 2: Active Deals */}
                <Link to="/deals" className="block">
                    <Card className="rounded-3xl border-none shadow-sm h-full hover:shadow-md transition-shadow">
                        <CardContent className="p-6 flex flex-col justify-between h-full">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Deals</p>
                                <h3 className="text-3xl font-bold mt-2">{activeDeals}</h3>
                            </div>
                            <div className="flex items-center text-green-600 text-sm mt-4">
                                <ArrowUpRight className="h-4 w-4 mr-1" />
                                <span>2.9% from last month</span>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                {/* Stat 3: Tasks */}
                <Link to="/tasks" className="block">
                    <Card className="rounded-3xl border-none shadow-sm h-full hover:shadow-md transition-shadow">
                        <CardContent className="p-6 flex flex-col justify-between h-full">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Pending Tasks</p>
                                <h3 className="text-3xl font-bold mt-2">{pendingTasks}</h3>
                            </div>
                            <div className="flex items-center text-green-600 text-sm mt-4">
                                <ArrowUpRight className="h-4 w-4 mr-1" />
                                <span>0.9% from last month</span>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Middle Grid: Main Chart (Placeholder) + Side Widget */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Large Chart Placeholder (2/3 width) */}
                <Card className="col-span-2 rounded-3xl border-none shadow-sm p-6 min-h-[300px] flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg">Total Revenue</h3>
                        <div className="bg-gray-100 p-2 rounded-xl">
                            <ArrowUpRight className="h-5 w-5 text-gray-500" />
                        </div>
                    </div>
                    {/* Simulated Bar Chart Visuals */}
                    <div className="flex-1 flex items-end justify-between space-x-2 px-4 pb-2">
                        {[65, 40, 75, 55, 60, 85].map((h, i) => (
                            <div key={i} className="group flex-1 flex flex-col items-center">
                                <div
                                    style={{ height: `${h}%` }}
                                    className={`w-full max-w-[40px] rounded-t-xl transition-all duration-300 ${i === 2 ? 'bg-gray-900 shadow-lg dark:bg-white' : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700'}`}
                                ></div>
                                <span className="text-xs text-muted-foreground mt-2">
                                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i]}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Side Widget (1/3 width) */}
                <div className="space-y-6">
                    {/* Calendar Widget */}
                    <Link to="/tasks">
                        <Card className="rounded-3xl border-none shadow-sm p-6 mb-6 hover:shadow-md transition-all cursor-pointer group">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-lg">September 2024</h3>
                                <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-black transition-colors" />
                            </div>
                            <div className="flex justify-between items-center text-center">
                                {[17, 18, 19, 20, 21].map((date, i) => (
                                    <div key={date} className={`flex flex-col items-center p-2 rounded-xl ${i === 2 ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500'}`}>
                                        <span className="text-xs mb-1">{['Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}</span>
                                        <span className="font-bold text-lg">{date}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </Link>

                    {/* Growth Widget */}
                    <Card className="rounded-3xl border-none shadow-sm p-6 flex items-center justify-between">
                        <div>
                            <h4 className="font-bold">Community growth</h4>
                            <p className="text-sm text-green-600 flex items-center mt-1">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                0.9% from last month
                            </p>
                        </div>
                        <div className="relative h-12 w-12 flex items-center justify-center">
                            <svg className="h-full w-full -rotate-90 text-gray-200" viewBox="0 0 36 36">
                                <path className="fill-none stroke-current stroke-[3]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path className="fill-none stroke-gray-900 stroke-[3] dark:stroke-white" strokeDasharray="65, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            </svg>
                            <span className="absolute text-xs font-bold">65%</span>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Recent Deals Table */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg">Deals</h3>
                    <Link to="/deals">
                        <div className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors">
                            <ArrowUpRight className="h-4 w-4" />
                        </div>
                    </Link>
                </div>
                <div className="space-y-4">
                    <div className="grid grid-cols-4 text-xs font-medium text-muted-foreground uppercase tracking-wider pb-2 border-b border-gray-100">
                        <span>Deal Name</span>
                        <span>Contact</span>
                        <span>Amount</span>
                        <span className="text-right">Status</span>
                    </div>
                    {deals?.slice(0, 5).map(deal => (
                        <div key={deal.id} className="grid grid-cols-4 items-center py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 rounded-lg px-2 -mx-2 transition-colors">
                            <div className="flex items-center space-x-3">
                                {/* Simulate deal icon */}
                                <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <TrendingUp className="h-4 w-4 text-gray-500" />
                                </div>
                                <span className="font-medium">{deal.name}</span>
                            </div>
                            <span className="text-sm text-gray-500">{deal.contacts?.name || "Unknown"}</span>
                            <span className="font-semibold">${deal.value?.toLocaleString()}</span>
                            <div className="text-right">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${deal.stage === 'Closed' ? 'bg-green-100 text-green-800' :
                                    deal.stage === 'Proposal' ? 'bg-blue-100 text-blue-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                    {deal.stage}
                                </span>
                            </div>
                        </div>
                    ))}
                    {!deals?.length && <p className="text-gray-400 py-4 text-center">No active deals found.</p>}
                </div>
            </div>
        </div>
    )
}
