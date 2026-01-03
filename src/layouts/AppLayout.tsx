import { useState } from "react"
import { Outlet, NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { GlobalSearch } from "@/components/search/GlobalSearch"
import {
    LayoutDashboard,
    LogOut,
    Settings,
    Users,
    CheckSquare,
    Menu,
    X,
    Briefcase
} from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

export default function AppLayout() {
    const { signOut, user } = useAuth()
    const { theme, setTheme } = useTheme()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const navigate = useNavigate()

    const handleSignOut = async () => {
        await signOut()
        navigate("/login")
    }

    const navItems = [
        { to: "/", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/contacts", icon: Users, label: "Contacts" },
        { to: "/deals", icon: Briefcase, label: "Deals" },
        { to: "/tasks", icon: CheckSquare, label: "Tasks" },
        { to: "/settings", icon: Settings, label: "Settings" },
    ]

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row font-sans">
            {/* Mobile Header */}
            <header className="md:hidden flex items-center justify-between p-4 border-b bg-card sticky top-0 z-50">
                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        {isSidebarOpen ? <X /> : <Menu />}
                    </Button>
                    <span className="font-bold text-xl">SkiCRM</span>
                </div>
                <div className="w-full max-w-[150px] ml-2">
                    <GlobalSearch />
                </div>
            </header>

            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-56 bg-card md:bg-transparent border-r md:border-none transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 flex flex-col justify-between py-4 pl-3",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-full pr-3 relative">
                    <div className="flex items-center space-x-2 mb-6 pl-3">
                        <span className="text-xl font-bold tracking-tight">SkiCRM</span>
                    </div>

                    <nav className="space-y-1 flex-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={() => setIsSidebarOpen(false)}
                                className={({ isActive }) => cn(
                                    "flex items-center space-x-3 px-3 py-2.5 rounded-full text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-black text-white shadow-md dark:bg-white dark:text-black"
                                        : "text-muted-foreground hover:bg-white/50 hover:text-foreground dark:hover:bg-white/10"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>

                    {/* Upgrade Banner Mockup Compact */}
                    <div className="mt-4 mx-auto w-full">
                        <div className="bg-gray-900 text-white rounded-2xl p-4 relative overflow-hidden shadow-lg dark:bg-gray-800">
                            <div className="absolute top-0 right-0 -mr-4 -mt-4 h-16 w-16 rounded-full bg-white/10 blur-xl"></div>
                            <h3 className="text-sm font-bold mb-0.5">Upgrade to Pro</h3>
                            <p className="text-[10px] text-gray-400 mb-2 leading-tight">Get access to additional features.</p>
                            <Button size="sm" className="w-full h-7 text-xs bg-white text-black hover:bg-gray-200 rounded-full font-bold">
                                Upgrade
                            </Button>
                        </div>
                    </div>

                    <div className="mt-4 space-y-1 pl-1">
                        <button onClick={handleSignOut} className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            <LogOut className="h-4 w-4" />
                            <span>Log out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden flex flex-col h-screen">
                <div className="h-full overflow-y-auto p-4 md:p-6 scroller-none">
                    <div className="max-w-7xl mx-auto space-y-4 h-full">
                        {/* Top Bar Area inside Main Content for Desktop feel */}
                        <div className="hidden md:flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold opacity-0">Dashboard</h2> {/* spacer */}
                            <div className="flex items-center space-x-3">
                                <div className="w-[240px]">
                                    <GlobalSearch />
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full bg-white shadow-sm"
                                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                >
                                    {theme === "dark" ? <Briefcase className="h-3 w-3" /> : <Briefcase className="h-3 w-3" />}
                                    <span className="sr-only">Toggle theme</span>
                                </Button>
                                <div className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
                                    {/* Avatar Placeholder */}
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} alt="Avatar" className="h-full w-full object-cover" />
                                </div>
                            </div>
                        </div>

                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    )
}
