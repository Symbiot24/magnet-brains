import { DashboardLayout } from '@/components/DashboardLayout';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Moon, Sun, Bell, Lock, User } from 'lucide-react';
import { useState } from 'react';
import { TaskDrawer } from '@/components/TaskDrawer';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { theme, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();
  const [taskDrawerOpen, setTaskDrawerOpen] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
    toast.success('Settings saved');
  };

  return (
    <DashboardLayout onNewTask={() => setTaskDrawerOpen(true)}>
      <div className="p-4 md:p-6 max-w-2xl mx-auto w-full">
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl font-semibold mb-2">
            Settings
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>

        <div className="space-y-6 md:space-y-8">
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-center gap-3 mb-6">
              <User className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-medium">Profile</h2>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
              <div className="h-14 w-14 rounded-md bg-muted flex items-center justify-center">
                <span className="text-lg font-medium">
                  {user?.name?.split(' ').map((n) => n[0]).join('')}
                </span>
              </div>
              <div>
                <h3 className="font-medium">{user?.name}</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue={user?.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email} />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-center gap-3 mb-6">
              {theme === 'dark' ? (
                <Moon className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Sun className="h-5 w-5 text-muted-foreground" />
              )}
              <h2 className="font-medium">Appearance</h2>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">
                  Toggle between light and dark themes
                </p>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-medium">Notifications</h2>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about task updates
                </p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-medium">Security</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
            </div>
          </div>

          <div>
            <Button onClick={handleSave} className="w-full">
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      <TaskDrawer
        isOpen={taskDrawerOpen}
        onClose={() => setTaskDrawerOpen(false)}
        mode="create"
      />
    </DashboardLayout>
  );
}
