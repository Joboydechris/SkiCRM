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
    Briefcase,
    PanelLeftClose,
    PanelLeftOpen,
    Sun,
    Moon,
    Laptop,
    Bell
} from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

export default function AppLayout() {
    const { signOut, user } = useAuth()
    const { theme, setTheme } = useTheme()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState(false)
    const navigate = useNavigate()

    const handleSignOut = async () => {
        await signOut()
        navigate("/login")
    }

    const cycleTheme = () => {
        if (theme === "light") setTheme("dark")
        else if (theme === "dark") setTheme("system")
        else setTheme("light")
    }

    const navItems = [
        { to: "/", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/contacts", icon: Users, label: "Contacts" },
        { to: "/deals", icon: Briefcase, label: "Deals" },
        { to: "/tasks", icon: CheckSquare, label: "Tasks" },
        { to: "/settings", icon: Settings, label: "Settings" },
    ]

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row font-sans overflow-hidden">
            {/* Mobile Header */}
            <header className="md:hidden flex items-center justify-between p-4 border-b bg-card sticky top-0 z-50">
                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        {isSidebarOpen ? <X /> : <Menu />}
                    </Button>
                    <span className="font-bold text-xl">SkiCRM</span>
                </div>
                <div className="w-full max-w-[150px] ml-2">
                    <GlobalSearch collapsed={false} />
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
                "fixed inset-y-0 left-0 z-50 bg-background border-r border-border shadow-sm transform transition-all duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col justify-between py-4",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full",
                isCollapsed ? "w-20 px-2" : "w-64 px-4"
            )}>
                <div className="flex flex-col h-full relative">
                    {/* Sidebar Header & Toggle */}
                    <div className={cn("flex items-center mb-6 transition-all duration-300", isCollapsed ? "justify-center" : "justify-between pl-2")}>
                        {!isCollapsed && <span className="text-xl font-bold tracking-tight truncate">SkiCRM</span>}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-foreground hidden md:flex"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                        >
                            {isCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
                        </Button>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-2 flex-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={() => setIsSidebarOpen(false)}
                                className={({ isActive }) => cn(
                                    "flex items-center px-3 py-2.5 rounded-full text-sm font-medium transition-all duration-200 group relative",
                                    isActive
                                        ? "bg-black text-white shadow-md dark:bg-white dark:text-black"
                                        : "text-muted-foreground hover:bg-gray-100 hover:text-foreground dark:hover:bg-gray-800",
                                    isCollapsed ? "justify-center" : "space-x-3"
                                )}
                            >
                                <item.icon className="h-5 w-5 flex-shrink-0" />
                                {!isCollapsed && <span className="truncate">{item.label}</span>}
                                {isCollapsed && (
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                        {item.label}
                                    </div>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Upgrade Banner (Hidden when collapsed) */}
                    <div className={cn("mt-4 mx-auto w-full transition-all duration-300 overflow-hidden", isCollapsed ? "h-0 opacity-0" : "h-auto opacity-100")}>
                        <div className="bg-gray-900 text-white rounded-2xl p-4 relative overflow-hidden shadow-lg dark:bg-gray-800">
                            <div className="absolute top-0 right-0 -mr-4 -mt-4 h-16 w-16 rounded-full bg-white/10 blur-xl"></div>
                            <h3 className="text-sm font-bold mb-0.5">Upgrade to Pro</h3>
                            <p className="text-[10px] text-gray-400 mb-2 leading-tight">Get access to additional features.</p>
                            <Button size="sm" className="w-full h-7 text-xs bg-white text-black hover:bg-gray-200 rounded-full font-bold">
                                Upgrade
                            </Button>
                        </div>
                    </div>

                    {/* User Profile & Logout */}
                    <div className="mt-4 pl-1 space-y-1">
                        <div className={cn(
                            "flex items-center rounded-lg text-sm font-medium transition-all duration-300 group hover:bg-gray-100 dark:hover:bg-gray-800 mb-1",
                            isCollapsed ? "justify-center w-full py-2" : "px-3 py-2 space-x-3 w-full"
                        )}>

                            <div className="h-8 w-8 rounded-full bg-muted border-2 border-background shadow-sm overflow-hidden flex flex-shrink-0 items-center justify-center text-xs font-bold text-muted-foreground">
                                {user?.email?.charAt(0).toUpperCase()}
                            </div>

                            {!isCollapsed && (
                                <div className="flex flex-col text-left overflow-hidden">
                                    <span className="truncate text-xs font-semibold text-foreground">{user?.user_metadata?.full_name || "User"}</span>
                                    <span className="truncate text-[10px] text-muted-foreground">{user?.email}</span>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleSignOut}
                            className={cn(
                                "flex items-center rounded-full text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 group hover:bg-gray-100 dark:hover:bg-gray-800",
                                isCollapsed ? "justify-center w-full py-3" : "px-3 py-2 space-x-3 w-full"
                            )}
                        >
                            <LogOut className="h-5 w-5 flex-shrink-0" />
                            {!isCollapsed ? (
                                <span>Log out</span>
                            ) : (
                                // Expand on hover logic for collapsed state
                                <span className="w-0 overflow-hidden opacity-0 group-hover:w-auto group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 whitespace-nowrap">
                                    Log out
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden flex flex-col h-screen bg-gray-50/50 dark:bg-background transition-all duration-300">
                <div className="h-full overflow-y-auto p-4 md:p-6 scroller-none">
                    <div className="max-w-7xl mx-auto space-y-4 h-full">
                        {/* Top Bar Area */}
                        <div className="hidden md:flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold opacity-0">Dashboard</h2> {/* spacer */}
                            <div className="flex items-center space-x-3">
                                <div className="z-20 w-[240px] max-w-[50vw]">
                                    <GlobalSearch collapsed={false} />
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 rounded-full bg-background border border-input shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors relative"
                                >
                                    <Bell className="h-4 w-4" />
                                    <span className="absolute top-2 right-2.5 h-1.5 w-1.5 rounded-full bg-red-500 ring-1 ring-white dark:ring-gray-900"></span>
                                    <span className="sr-only">Notifications</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 rounded-full bg-background border border-input shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                                    onClick={cycleTheme}
                                    title={`Current theme: ${theme}`}
                                >
                                    {theme === "light" && <Sun className="h-4 w-4" />}
                                    {theme === "dark" && <Moon className="h-4 w-4" />}
                                    {theme === "system" && <Laptop className="h-4 w-4" />}
                                    <span className="sr-only">Toggle theme</span>
                                </Button>
                            </div>
                        </div>

                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    )
}
