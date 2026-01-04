import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getContacts } from "@/services/apiContacts"
import { getDeals } from "@/services/apiDeals"
import { getTasks } from "@/services/apiTasks"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import { Users, FolderKanban, CheckSquare, Search } from "lucide-react"
import { cn } from "@/lib/utils"

export function GlobalSearch({ collapsed = false }: { collapsed?: boolean }) {
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()

    const { data: contacts } = useQuery({ queryKey: ["contacts"], queryFn: getContacts })
    const { data: deals } = useQuery({ queryKey: ["deals"], queryFn: getDeals })
    const { data: tasks } = useQuery({ queryKey: ["tasks"], queryFn: getTasks })

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const runCommand = (command: () => void) => {
        setOpen(false)
        command()
    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className={cn(
                    "inline-flex items-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 relative w-full justify-start text-sm text-muted-foreground",
                    collapsed ? "w-9 px-0 justify-center" : "w-full md:w-64"
                )}
            >
                <Search className={cn("h-4 w-4", collapsed ? "mr-0" : "mr-2")} />
                {!collapsed && (
                    <>
                        <span className="hidden lg:inline-flex">Search...</span>
                        <span className="inline-flex lg:hidden">Search...</span>
                        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </>
                )}
            </button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Contacts">
                        {contacts?.map((contact) => (
                            <CommandItem
                                key={contact.id}
                                onSelect={() => runCommand(() => navigate(`/contacts/${contact.id}`))}
                            >
                                <Users className="mr-2 h-4 w-4" />
                                <span>{contact.name}</span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Deals">
                        {deals?.map((deal) => (
                            <CommandItem
                                key={deal.id}
                                onSelect={() => runCommand(() => navigate("/deals"))}
                            >
                                <FolderKanban className="mr-2 h-4 w-4" />
                                <span>{deal.name}</span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Tasks">
                        {tasks?.map((task) => (
                            <CommandItem
                                key={task.id}
                                onSelect={() => runCommand(() => navigate("/tasks"))}
                            >
                                <CheckSquare className="mr-2 h-4 w-4" />
                                <span>{task.title}</span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}
