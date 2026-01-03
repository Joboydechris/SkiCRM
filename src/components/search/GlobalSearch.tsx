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
    const [isExpanded, setIsExpanded] = useState(false)
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
            <div className={cn("relative flex items-center transition-all duration-300 ease-in-out", isExpanded ? "w-64" : "w-10")}>
                <button
                    onClick={() => {
                        setIsExpanded(true)
                        setOpen(true)
                    }}
                    onBlur={() => {
                        // Optional: collapse if not active, but 'open' dialog handles interaction usually.
                        // We'll keep it expanded if the dialog is open or simulate interaction. 
                        // Actually, better to just let it be a button that opens the dialog.
                        // The prompt asked for "turns into a search bar when clicked".
                        // A truly expanding input inside the header is complex if it invokes a command palette.
                        // We will simulate the "bar" look.
                        setIsExpanded(false)
                    }}
                    className={cn(
                        "inline-flex items-center rounded-full font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 overflow-hidden whitespace-nowrap",
                        isExpanded || !collapsed ? "w-64 px-4 justify-start" : "w-9 justify-center px-0"
                    )}
                >
                    <Search className="h-4 w-4 shrink-0" />
                    <span className={cn("ml-2 text-sm text-muted-foreground transition-opacity duration-300", isExpanded || !collapsed ? "opacity-100" : "opacity-0 w-0 hidden")}>Search...</span>
                    {(isExpanded || !collapsed) && (
                        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    )}
                </button>
            </div>
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
