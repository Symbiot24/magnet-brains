export function TaskCardSkeleton() {
  return (
    <div className="task-card animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 skeleton rounded" />
          <div className="h-3 w-full skeleton rounded" />
          <div className="h-3 w-2/3 skeleton rounded" />
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
        <div className="h-4 w-16 skeleton rounded" />
        <div className="flex items-center gap-2">
          <div className="h-5 w-16 skeleton rounded" />
          <div className="h-6 w-6 skeleton rounded" />
        </div>
      </div>
    </div>
  );
}

export function PriorityColumnSkeleton() {
  return (
    <div className="priority-column bg-muted/30 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="h-5 w-28 skeleton rounded" />
        <div className="h-5 w-8 skeleton rounded" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <TaskCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function KanbanBoardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <PriorityColumnSkeleton />
      <PriorityColumnSkeleton />
      <PriorityColumnSkeleton />
    </div>
  );
}
