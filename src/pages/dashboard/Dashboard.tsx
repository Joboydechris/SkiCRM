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

    // Total Revenue from Closed deals only
    const totalRevenue = deals
        ?.filter(d => d.stage === 'Closed')
        .reduce((sum, d) => sum + (d.value || 0), 0) || 0

    const pendingTasks = tasks?.filter(t => !t.completed).length || 0

    // Revenue Trends: Last 6 months
    const getLast6Months = () => {
        const months = []
        for (let i = 5; i >= 0; i--) {
            const d = new Date()
            d.setMonth(d.getMonth() - i)
            months.push(d.toLocaleString("default", { month: "short" }))
        }
        return months
    }

    const monthlyRevenue = getLast6Months().map(month => {
        const value = deals
            ?.filter(d => d.stage === 'Closed')
            .filter(d => {
                const dealDate = d.expected_close_date ? new Date(d.expected_close_date) : new Date(d.created_at || "")
                return dealDate.toLocaleString("default", { month: "short" }) === month
            })
            .reduce((sum, d) => sum + (d.value || 0), 0) || 0
        return { month, value }
    })

    const maxRevenue = Math.max(...monthlyRevenue.map(m => m.value), 1)

    // Calendar: Next 5 days
    const next5Days = Array.from({ length: 5 }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() + i)
        return {
            name: d.toLocaleString('default', { weekday: 'narrow' }), // M, T, W
            date: d.getDate(),
            fullDate: d.toISOString().split('T')[0],
            hasTask: tasks?.some(t => !t.completed && t.due_date && t.due_date.startsWith(d.toISOString().split('T')[0]))
        }
    })

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
                        <h3 className="text-xl font-bold mt-0.5">${totalRevenue.toLocaleString()}</h3>
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
                    {/* Real-time Bar Chart Visuals */}
                    <div className="flex-1 flex items-end justify-between space-x-2 px-2 pb-1 relative">
                        {monthlyRevenue.length === 0 ? (
                            <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                                No closed deals yet
                            </div>
                        ) : (
                            monthlyRevenue.map((data, i) => {
                                const heightPercentage = maxRevenue > 0 ? (data.value / maxRevenue) * 100 : 0
                                return (
                                    <div key={i} className="group flex-1 flex flex-col items-center relative">
                                        <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 text-[10px] bg-black text-white px-1 rounded transition-opacity whitespace-nowrap z-10">
                                            {data.month}: ${data.value.toLocaleString()}
                                        </div>
                                        <div
                                            style={{ height: `${Math.max(heightPercentage, 4)}%` }} // Min height 4% for visibility
                                            className={`w-full max-w-[20px] rounded-t-sm transition-all duration-500 ${heightPercentage > 0 ? 'bg-gray-900 shadow-md dark:bg-white' : 'bg-gray-100 dark:bg-gray-800'}`}
                                        ></div>
                                        <span className="text-[9px] text-gray-400 mt-1">{data.month.slice(0, 3)}</span>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </Card>

                {/* Side Widgets (1/3 width) - Stacked vertically */}
                <div className="space-y-3 flex flex-col h-full">
                    {/* Calendar Widget Compact */}
                    <Link to="/tasks" className="block h-full">
                        <Card className="rounded-2xl border-none shadow-sm p-3 hover:shadow-md transition-all cursor-pointer group h-full flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-bold text-xs">{new Date().toLocaleString('default', { month: 'short', year: 'numeric' })}</h3>
                                <ArrowUpRight className="h-3 w-3 text-gray-400 group-hover:text-black transition-colors" />
                            </div>
                            <div className="flex justify-between items-center text-center flex-1">
                                {next5Days.map((day, i) => (
                                    <div key={i} className={`flex flex-col items-center p-1 rounded-lg ${i === 0 ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500'} relative`}>
                                        <span className="text-[9px] mb-0.5">{day.name}</span>
                                        <span className="font-bold text-xs">{day.date}</span>
                                        {/* Task Indicator Dot */}
                                        {day.hasTask && (
                                            <span className={`absolute -bottom-1 h-1 w-1 rounded-full ${i === 0 ? 'bg-white' : 'bg-red-500'}`}></span>
                                        )}
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
