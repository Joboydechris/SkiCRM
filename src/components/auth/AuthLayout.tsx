import { Outlet } from "react-router-dom"
import { Mountain } from "lucide-react"

export default function AuthLayout() {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Side - Form */}
            <div className="flex flex-col justify-center items-center p-8 bg-background">
                <div className="w-full max-w-md space-y-8">
                    <div className="flex flex-col items-center space-y-2 text-center">
                        <div className="flex items-center space-x-2">
                            <Mountain className="h-8 w-8 text-primary" />
                            <span className="text-2xl font-bold tracking-tight">SkiCRM</span>
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Welcome back
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your credentials to access your account
                        </p>
                    </div>
                    <Outlet />
                </div>
            </div>

            {/* Right Side - Visual */}
            <div className="hidden lg:flex flex-col bg-muted text-white dark:border-r relative overflow-hidden">
                <div className="absolute inset-0 bg-zinc-900" />
                {/* Abstract pattern overlay */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />

                <div className="relative z-20 flex pt-20 justify-center h-full items-center p-10">
                    <div className="space-y-6 max-w-lg text-center">
                        <h2 className="text-4xl font-bold tracking-tighter">
                            Unlock your future growth
                        </h2>
                        <p className="text-lg text-zinc-400">
                            Through perpetual investment strategies that outperform the market.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
