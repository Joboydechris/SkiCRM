import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getTasks, updateTask, deleteTask } from "@/services/apiTasks"
import { AddTaskDialog } from "./components/AddTaskDialog"
import { TaskItem } from "./components/TaskItem"
import { Loader2, CheckSquare } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function Tasks() {
    const queryClient = useQueryClient()

    const { data: tasks, isLoading } = useQuery({
        queryKey: ["tasks"],
        queryFn: getTasks,
    })

    const updateMutation = useMutation({
        mutationFn: updateTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] })
        }
    })

    const deleteMutation = useMutation({
        mutationFn: deleteTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] })
        }
    })

    if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>

    const completedCount = tasks?.filter(t => t.completed).length || 0
    const totalCount = tasks?.length || 0
    const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <CheckSquare className="h-8 w-8 text-primary" />
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
                        <p className="text-muted-foreground">Stay on top of your todo list.</p>
                    </div>
                </div>
                <AddTaskDialog />
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Progress</span>
                    <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
            </div>

            <div className="space-y-6">
                {(!tasks || tasks.length === 0) && (
                    <div className="text-center py-10 text-muted-foreground border rounded-lg border-dashed">
                        No tasks yet. Create one to get started!
                    </div>
                )}

                {/* Overdue */}
                {tasks?.some(t => !t.completed && t.due_date && new Date(t.due_date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) && (
                    <div className="space-y-2">
                        <h2 className="text-sm font-semibold text-destructive">Overdue</h2>
                        {tasks.filter(t => !t.completed && t.due_date && new Date(t.due_date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0))
                            .map(task => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    onToggle={(id, completed) => updateMutation.mutate({ id, updates: { completed } })}
                                    onDelete={(id) => deleteMutation.mutate(id)}
                                />
                            ))}
                    </div>
                )}

                {/* Due Today */}
                {tasks?.some(t => !t.completed && t.due_date && new Date(t.due_date).toDateString() === new Date().toDateString()) && (
                    <div className="space-y-2">
                        <h2 className="text-sm font-semibold text-primary">Due Today</h2>
                        {tasks.filter(t => !t.completed && t.due_date && new Date(t.due_date).toDateString() === new Date().toDateString())
                            .map(task => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    onToggle={(id, completed) => updateMutation.mutate({ id, updates: { completed } })}
                                    onDelete={(id) => deleteMutation.mutate(id)}
                                />
                            ))}
                    </div>
                )}

                {/* Upcoming */}
                {tasks?.some(t => !t.completed && t.due_date && new Date(t.due_date).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0)) && (
                    <div className="space-y-2">
                        <h2 className="text-sm font-semibold">Upcoming</h2>
                        {tasks.filter(t => !t.completed && t.due_date && new Date(t.due_date).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0))
                            .map(task => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    onToggle={(id, completed) => updateMutation.mutate({ id, updates: { completed } })}
                                    onDelete={(id) => deleteMutation.mutate(id)}
                                />
                            ))}
                    </div>
                )}

                {/* Later / No Date */}
                {tasks?.some(t => !t.completed && !t.due_date) && (
                    <div className="space-y-2">
                        <h2 className="text-sm font-semibold">Later</h2>
                        {tasks.filter(t => !t.completed && !t.due_date)
                            .map(task => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    onToggle={(id, completed) => updateMutation.mutate({ id, updates: { completed } })}
                                    onDelete={(id) => deleteMutation.mutate(id)}
                                />
                            ))}
                    </div>
                )}

                {/* Completed */}
                {completedCount > 0 && (
                    <div className="space-y-2 pt-4 border-t">
                        <h2 className="text-sm font-semibold text-muted-foreground">Completed</h2>
                        {tasks?.filter(t => t.completed).map(task => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onToggle={(id, completed) => updateMutation.mutate({ id, updates: { completed } })}
                                onDelete={(id) => deleteMutation.mutate(id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
