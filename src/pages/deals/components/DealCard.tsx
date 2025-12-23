import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Deal } from "@/types"

interface DealCardProps {
    deal: Deal & { contacts: { name: string } | null }
}

export function DealCard({ deal }: DealCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: deal.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <Card
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="cursor-move hover:border-primary/50 transition-colors mb-3"
        >
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium">{deal.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>{deal.contacts?.name || "No Contact"}</span>
                    <span className="font-semibold text-foreground">${deal.value?.toLocaleString()}</span>
                </div>
                {deal.expected_close_date && (
                    <div className="mt-2 text-xs text-muted-foreground">
                        Close: {new Date(deal.expected_close_date).toLocaleDateString()}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
