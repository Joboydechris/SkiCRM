import { useState } from "react"
import { Outlet, NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import {
    FolderKanban,
    LayoutDashboard,
    LogOut,
    Settings,
    Users,
    CheckSquare,
    Menu,
    X,
    Mountain
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
        { to: "/deals", icon: FolderKanban, label: "Deals" },
        { to: "/tasks", icon: CheckSquare, label: "Tasks" },
        { to: "/settings", icon: Settings, label: "Settings" },
    ]

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row">
            {/* Mobile Header */}
            <header className="md:hidden flex items-center justify-between p-4 border-b bg-card">
                <div className="flex items-center space-x-2">
                    <Mountain className="h-6 w-6 text-primary" />
                    <span className="font-bold">SkiCRM</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    {isSidebarOpen ? <X /> : <Menu />}
                </Button>
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
                "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 flex flex-col justify-between",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6">
                    <div className="flex items-center space-x-2 mb-8 md:flex">
                        <Mountain className="h-8 w-8 text-primary" />
                        <span className="text-xl font-bold tracking-tight">SkiCRM</span>
                    </div>

                    <nav className="space-y-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={() => setIsSidebarOpen(false)}
                                className={({ isActive }) => cn(
                                    "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className="p-6 border-t space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Theme</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        >
                            {theme === "dark" ? "Dark" : "Light"}
                        </Button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-sm font-medium truncate w-[120px]">{user?.user_metadata?.full_name || "User"}</span>
                            <span className="text-xs text-muted-foreground truncate w-[120px]">{user?.email}</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sign Out">
                            <LogOut className="h-5 w-5 text-muted-foreground hover:text-destructive" />
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                <Outlet />
            </main>
        </div>
    )
}
