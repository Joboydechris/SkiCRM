import type { Task } from "@/types"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface TaskItemProps {
    task: Task
    onToggle: (id: string, completed: boolean) => void
    onDelete: (id: string) => void
    isPending?: boolean
}

export function TaskItem({ task, onToggle, onDelete, isPending }: TaskItemProps) {
    return (
        <div className={cn(
            "flex items-center justify-between p-4 border rounded-lg bg-card transition-all hover:shadow-sm",
            task.completed && "opacity-60 bg-muted/50"
        )}>
            <div className="flex items-center space-x-4">
                <Checkbox
                    checked={task.completed}
                    onCheckedChange={(checked: boolean | string) => onToggle(task.id, !!checked)}
                    disabled={isPending}
                />
                <div className="space-y-1">
                    <p className={cn("font-medium", task.completed && "line-through text-muted-foreground")}>
                        {task.title}
                    </p>
                    {task.due_date && (
                        <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="mr-1 h-3 w-3" />
                            {new Date(task.due_date).toLocaleDateString()}
                        </div>
                    )}
                </div>
            </div>

            <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)} disabled={isPending}>
                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
            </Button>
        </div>
    )
}
