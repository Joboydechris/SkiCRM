import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
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

    const [timeRange, setTimeRange] = useState<'daily' | 'weekly'>('weekly')

    const isLoading = loadingContacts || loadingDeals || loadingTasks

    if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>

    // Helper: Calculate Growth
    const calculateGrowth = (items: any[], dateField: string = 'created_at', valueField?: string) => {
        if (!items?.length) return 0

        const now = new Date()
        const currentStart = new Date()
        const previousStart = new Date()
        const previousEnd = new Date()

        if (timeRange === 'daily') {
            currentStart.setHours(0, 0, 0, 0)
            previousStart.setDate(currentStart.getDate() - 1)
            previousStart.setHours(0, 0, 0, 0)
            previousEnd.setDate(currentStart.getDate() - 1)
            previousEnd.setHours(23, 59, 59, 999)
        } else {
            // Weekly: Last 7 days vs 7 days before that
            currentStart.setDate(now.getDate() - 7)
            previousStart.setDate(now.getDate() - 14)
            previousEnd.setDate(now.getDate() - 7)
        }

        const currentPeriodItems = items.filter(item => {
            const date = new Date(item[dateField])
            return date >= currentStart && date <= now
        })

        const previousPeriodItems = items.filter(item => {
            const date = new Date(item[dateField])
            return date >= previousStart && date < previousEnd // < previousEnd to avoid overlap if using 'now' boundary logic strictly
            // Simplified for logic:
            // Daily: Today vs Yesterday
            // Weekly: Last 7d vs Prev 7d
        })

        // Value based (Sum) or Count based
        const currentValue = valueField
            ? currentPeriodItems.reduce((sum, item) => sum + (Number(item[valueField]) || 0), 0)
            : currentPeriodItems.length

        const previousValue = valueField
            ? previousPeriodItems.reduce((sum, item) => sum + (Number(item[valueField]) || 0), 0)
            : previousPeriodItems.length

        if (previousValue === 0) return currentValue > 0 ? 100 : 0

        return ((currentValue - previousValue) / previousValue) * 100
    }

    // Metrics
    const totalContacts = contacts?.length || 0
    const contactGrowth = calculateGrowth(contacts || [], 'created_at')

    const activeDeals = deals?.filter(d => d.stage !== 'Closed').length || 0
    const dealGrowth = calculateGrowth(deals?.filter(d => d.stage !== 'Closed') || [], 'created_at')

    const totalRevenue = deals
        ?.filter(d => d.stage === 'Closed')
        .reduce((sum, d) => sum + (d.value || 0), 0) || 0
    // Revenue Growth: Compare closed deals revenue in periods
    // NOTE: 'created_at' for revenue growth might be better as 'updated_at' or 'close_date' if available, defaulting to created_at for MVP if close_date is not set. 
    // Usually Closed Date is better. Let's use expected_close_date or updated_at if possible. 
    // For now, using created_at as proxy or I check if I have updated_at. I added it. Let's use `updated_at` for Closed deals as proxy for "Closed At".
    // Re-defining revenue growth below to use updated_at:
    const revenueGrowthCalculated = calculateGrowth(deals?.filter(d => d.stage === 'Closed') || [], 'updated_at', 'value')


    const pendingTasks = tasks?.filter(t => !t.completed).length || 0
    const taskGrowth = calculateGrowth(tasks?.filter(t => !t.completed) || [], 'created_at')

    // ... (Revenue Trends Logic - Existing) ...
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
                {/* Time Range Selector */}
                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 text-xs font-medium">
                    <button
                        onClick={() => setTimeRange('daily')}
                        className={`px-3 py-1 rounded-md transition-all ${timeRange === 'daily' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
                    >
                        Daily
                    </button>
                    <button
                        onClick={() => setTimeRange('weekly')}
                        className={`px-3 py-1 rounded-md transition-all ${timeRange === 'weekly' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
                    >
                        Weekly
                    </button>
                </div>
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
                    <div className={`flex items-center text-[10px] mt-1 z-10 ${revenueGrowthCalculated >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        <TrendingUp className={`h-3 w-3 mr-1 ${revenueGrowthCalculated < 0 ? 'rotate-180' : ''}`} />
                        <span>{revenueGrowthCalculated >= 0 ? '+' : ''}{revenueGrowthCalculated.toFixed(1)}%</span>
                        <span className="text-gray-500 ml-1 opacity-60">vs last {timeRange === 'daily' ? 'day' : 'week'}</span>
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
                            <div className={`flex items-center text-[10px] mt-1 ${contactGrowth >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                <ArrowUpRight className={`h-3 w-3 mr-1 ${contactGrowth < 0 ? 'rotate-180' : ''}`} />
                                <span>{contactGrowth >= 0 ? '+' : ''}{contactGrowth.toFixed(1)}%</span>
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
                            <div className={`flex items-center text-[10px] mt-1 ${dealGrowth >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                <ArrowUpRight className={`h-3 w-3 mr-1 ${dealGrowth < 0 ? 'rotate-180' : ''}`} />
                                <span>{dealGrowth >= 0 ? '+' : ''}{dealGrowth.toFixed(1)}%</span>
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
                            <div className={`flex items-center text-[10px] mt-1 ${taskGrowth >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                <ArrowUpRight className={`h-3 w-3 mr-1 ${taskGrowth < 0 ? 'rotate-180' : ''}`} />
                                <span>{taskGrowth >= 0 ? '+' : ''}{taskGrowth.toFixed(1)}%</span>
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
