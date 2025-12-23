import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
    DndContext,
    DragOverlay,
    useSensors,
    useSensor,
    PointerSensor,
    closestCorners,
    type DragEndEvent,
    type DragStartEvent,
} from "@dnd-kit/core"
import { getDeals, updateDeal } from "@/services/apiDeals"
import { DealColumn } from "./components/DealColumn"
import { DealCard } from "./components/DealCard"
import { AddDealDialog } from "./components/AddDealDialog"
import { Loader2 } from "lucide-react"

const STAGES = ["Lead", "Qualified", "Proposal", "Closed"]

export default function Deals() {
    const queryClient = useQueryClient()
    const [activeId, setActiveId] = useState<string | null>(null)

    const { data: deals, isLoading } = useQuery({
        queryKey: ["deals"],
        queryFn: getDeals,
    })

    const updateMutation = useMutation({
        mutationFn: updateDeal,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["deals"] })
        },
    })

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    )

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            let newStage = over.id as string

            if (!STAGES.includes(newStage)) {
                const overDeal = deals?.find(d => d.id === newStage)
                if (overDeal) newStage = overDeal.stage
            }

            if (STAGES.includes(newStage)) {
                updateMutation.mutate({
                    id: active.id as string,
                    updates: { stage: newStage }
                })
            }
        }
        setActiveId(null)
    }

    if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>

    const activeDeal = deals?.find(d => d.id === activeId)

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col space-y-4">
            <div className="flex justify-between items-center px-2">
                <h1 className="text-3xl font-bold">Pipeline</h1>
                <AddDealDialog />
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="flex items-start space-x-6 pb-4 overflow-x-auto h-full px-2">
                    {STAGES.map(stage => (
                        <DealColumn
                            key={stage}
                            id={stage}
                            title={stage}
                            deals={deals?.filter(d => d.stage === stage) || []}
                        />
                    ))}
                </div>

                <DragOverlay>
                    {activeDeal ? (
                        <div className="w-80">
                            <DealCard deal={activeDeal} />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    )
}
