import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  isLoading?: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  isLoading = false,
}: DeleteConfirmModalProps) {
  return (
    <>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-md z-50">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-foreground" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-medium mb-1">Delete Task</h2>
                  <p className="text-sm text-muted-foreground">
                    Are you sure you want to delete <span className="font-medium text-foreground">"{title}"</span>? This action cannot be undone.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={onConfirm}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Delete Task'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
