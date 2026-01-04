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
        <div className="space-y-4 h-full flex flex-col justify-center">
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
            </div>

            {/* Top Grid: Revenue Card (Dark) + 3 Stats Cards - Compact Vertical */}
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                {/* Featured "Revenue" Card */}
                <div className="bg-gray-900 rounded-2xl p-4 text-white relative overflow-hidden shadow-md flex flex-col justify-between min-h-[100px] dark:bg-gray-800">
                    <div className="absolute top-0 right-0 -mr-6 -mt-6 h-20 w-20 rounded-full bg-white/10 blur-xl"></div>
                    <div className="z-10">
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Total Revenue</p>
                        <h3 className="text-xl font-bold mt-0.5">${totalPipelineValue.toLocaleString()}</h3>
                    </div>
                    <div className="flex items-center text-green-400 text-[10px] mt-1 z-10">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        <span>+4.2%</span>
                    </div>
                </div>

                {/* Stat 1: Contacts */}
                <Link to="/contacts" className="block">
                    <Card className="rounded-2xl border-none shadow-sm h-full hover:shadow-md transition-shadow">
                        <CardContent className="p-4 flex flex-col justify-between h-full">
                            <div>
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Active Contacts</p>
                                <h3 className="text-xl font-bold mt-0.5">{totalContacts}</h3>
                            </div>
                            <div className="flex items-center text-green-600 text-[10px] mt-1">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                <span>12%</span>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                {/* Stat 2: Active Deals */}
                <Link to="/deals" className="block">
                    <Card className="rounded-2xl border-none shadow-sm h-full hover:shadow-md transition-shadow">
                        <CardContent className="p-4 flex flex-col justify-between h-full">
                            <div>
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Active Deals</p>
                                <h3 className="text-xl font-bold mt-0.5">{activeDeals}</h3>
                            </div>
                            <div className="flex items-center text-green-600 text-[10px] mt-1">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                <span>2.9%</span>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                {/* Stat 3: Tasks */}
                <Link to="/tasks" className="block">
                    <Card className="rounded-2xl border-none shadow-sm h-full hover:shadow-md transition-shadow">
                        <CardContent className="p-4 flex flex-col justify-between h-full">
                            <div>
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Pending Tasks</p>
                                <h3 className="text-xl font-bold mt-0.5">{pendingTasks}</h3>
                            </div>
                            <div className="flex items-center text-green-600 text-[10px] mt-1">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                <span>0.9%</span>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Middle Grid: Main Chart + Side Widgets - Compacted */}
            <div className="grid gap-3 md:grid-cols-3 flex-1 min-h-0">
                {/* Large Chart Placeholder (2/3 width) */}
                <Card className="col-span-2 rounded-2xl border-none shadow-sm p-4 min-h-[160px] flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-sm">Revenue Trends</h3>
                        <div className="bg-gray-100 p-1.5 rounded-lg">
                            <ArrowUpRight className="h-3.5 w-3.5 text-gray-500" />
                        </div>
                    </div>
                    {/* Simulated Bar Chart Visuals Compact */}
                    <div className="flex-1 flex items-end justify-between space-x-2 px-2 pb-1">
                        {[65, 40, 75, 55, 60, 85, 90, 45, 70, 60, 75, 80].slice(0, 12).map((h, i) => (
                            <div key={i} className="group flex-1 flex flex-col items-center">
                                <div
                                    style={{ height: `${h}%` }}
                                    className={`w-full max-w-[20px] rounded-t-sm transition-all duration-300 ${i === 5 ? 'bg-gray-900 shadow-md dark:bg-white' : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700'}`}
                                ></div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Side Widgets (1/3 width) - Stacked vertically */}
                <div className="space-y-3 flex flex-col h-full">
                    {/* Calendar Widget Compact */}
                    <Link to="/tasks" className="block h-full">
                        <Card className="rounded-2xl border-none shadow-sm p-3 hover:shadow-md transition-all cursor-pointer group h-full flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-bold text-xs">Sep 2024</h3>
                                <ArrowUpRight className="h-3 w-3 text-gray-400 group-hover:text-black transition-colors" />
                            </div>
                            <div className="flex justify-between items-center text-center flex-1">
                                {[17, 18, 19, 20, 21].map((date, i) => (
                                    <div key={date} className={`flex flex-col items-center p-1 rounded-lg ${i === 2 ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500'}`}>
                                        <span className="text-[9px] mb-0.5">{['T', 'W', 'T', 'F', 'S'][i]}</span>
                                        <span className="font-bold text-xs">{date}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </Link>
                </div>
            </div>

            {/* Recent Deals Table Compact (Limit 3) */}
            <div className="bg-white rounded-2xl p-4 shadow-sm flex-1 min-h-0 overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-sm">Recent Deals</h3>
                    <Link to="/deals">
                        <div className="bg-gray-100 p-1.5 rounded-full hover:bg-gray-200 transition-colors">
                            <ArrowUpRight className="h-3 w-3" />
                        </div>
                    </Link>
                </div>
                <div className="space-y-1">
                    {deals?.slice(0, 3).map(deal => (
                        <div key={deal.id} className="grid grid-cols-4 items-center py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 rounded-lg px-2 -mx-2 transition-colors">
                            <div className="flex items-center space-x-2">
                                <div className="h-6 w-6 rounded-md bg-gray-100 flex items-center justify-center">
                                    <TrendingUp className="h-3 w-3 text-gray-500" />
                                </div>
                                <span className="font-medium text-xs truncate max-w-[100px]">{deal.name}</span>
                            </div>
                            <span className="text-xs text-gray-500 truncate">{deal.contacts?.name || "Unknown"}</span>
                            <span className="font-semibold text-xs">${deal.value?.toLocaleString()}</span>
                            <div className="text-right">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${deal.stage === 'Closed' ? 'bg-green-100 text-green-800' :
                                    deal.stage === 'Proposal' ? 'bg-blue-100 text-blue-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                    {deal.stage}
                                </span>
                            </div>
                        </div>
                    ))}
                    {!deals?.length && <p className="text-gray-400 py-2 text-center text-xs">No active deals found.</p>}
                </div>
            </div>
        </div>
    )
}
