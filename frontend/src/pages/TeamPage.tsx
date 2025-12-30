import { DashboardLayout } from '@/components/DashboardLayout';
import { useTaskStore } from '@/store/taskStore';
import { Mail, ListTodo, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { TaskDrawer } from '@/components/TaskDrawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { api } from '@/services/api';

export default function TeamPage() {
  const { tasks, fetchTasks, fetchUsers } = useTaskStore();
  const [taskDrawerOpen, setTaskDrawerOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myTeam, setMyTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMyTeam = async () => {
    try {
      const team = await api.getMyTeam();
      setMyTeam(team);
      setLoading(false);
    } catch (error: any) {
      console.error('Failed to load team:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
    loadMyTeam();
  }, [fetchTasks, fetchUsers]);

  const getUserStats = (userId: string) => {
    const userTasks = tasks.filter((t) => t.assignee?.id === userId);
    const completed = userTasks.filter((t) => t.status === 'completed').length;
    return { total: userTasks.length, completed };
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await api.addTeamMember(memberEmail);
      toast.success('Team member added to your list');
      setAddModalOpen(false);
      setMemberEmail('');
      loadMyTeam();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add team member');
    }
    
    setIsSubmitting(false);
  };

  const handleRemoveMember = async (userId: string, userName: string) => {
    if (!confirm(`Remove ${userName} from your team list?`)) return;
    
    try {
      await api.removeTeamMember(userId);
      toast.success('Team member removed from your list');
      loadMyTeam();
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove team member');
    }
  };

  if (loading) {
    return (
      <DashboardLayout onNewTask={() => setTaskDrawerOpen(true)}>
        <div className="p-4 md:p-6">
          <div className="text-center text-muted-foreground">Loading your team...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout onNewTask={() => setTaskDrawerOpen(true)}>
      <div className="p-4 md:p-6">
        <div className="mb-6 md:mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold mb-2">
              My Team
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Manage your personal team list to track tasks easily
            </p>
          </div>
          
          <Button onClick={() => setAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>

        {myTeam.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Your team list is empty</p>
            <Button onClick={() => setAddModalOpen(true)} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add your first team member
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {myTeam.map((member) => {
              const stats = getUserStats(member.id || member._id);
              const memberId = member.id || member._id;
              return (
                <div
                  key={memberId}
                  className="bg-card rounded-lg p-6 border border-border card-hover relative"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemoveMember(memberId, member.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex flex-col items-center text-center mb-4">
                    <div className="h-14 w-14 rounded-md bg-muted flex items-center justify-center mb-3">
                      <span className="text-lg font-medium">
                        {member.name.split(' ').map((n: string) => n[0]).join('')}
                      </span>
                    </div>
                    <h3 className="font-medium">{member.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <Mail className="h-3 w-3" />
                      <span>{member.email}</span>
                    </div>
                  </div>

                  <div className="flex justify-center gap-6 pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <ListTodo className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium">{stats.total}</span>{' '}
                        <span className="text-muted-foreground">tasks</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium">{stats.completed}</span>{' '}
                        <span className="text-muted-foreground">done</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <TaskDrawer
        isOpen={taskDrawerOpen}
        onClose={() => setTaskDrawerOpen(false)}
        mode="create"
      />

      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddMember} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter team member's email"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Add an existing user to your personal team list by their email
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setAddModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add to My Team'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
