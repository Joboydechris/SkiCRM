import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { DealCard } from "./DealCard"
import type { Deal } from "@/types"

interface DealColumnProps {
    id: string
    title: string
    deals: (Deal & { contacts: { name: string } | null })[]
}

export function DealColumn({ id, title, deals }: DealColumnProps) {
    const { setNodeRef } = useDroppable({ id })

    const totalValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0)

    return (
        <div className="flex flex-col h-full bg-muted/30 rounded-lg p-4 w-80 shrink-0">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-sm">{title} <span className="text-muted-foreground ml-1">({deals.length})</span></h3>
                <span className="text-xs font-medium text-muted-foreground">${totalValue.toLocaleString()}</span>
            </div>

            <SortableContext id={id} items={deals.map(d => d.id)} strategy={verticalListSortingStrategy}>
                <div ref={setNodeRef} className="flex-1 overflow-y-auto min-h-[100px]">
                    {deals.map(deal => (
                        <DealCard key={deal.id} deal={deal} />
                    ))}
                </div>
            </SortableContext>
        </div>
    )
}
