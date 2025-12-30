import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ListTodo,
  Users,
  Settings,
  LogOut,
  X,
  CheckSquare,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: ListTodo, label: 'All Tasks', path: '/tasks' },
  { icon: CheckSquare, label: 'Assigned to Me', path: '/assigned' },
  { icon: Users, label: 'Team', path: '/team' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const { logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        style={{ width: collapsed ? 72 : 240 }}
        className="h-screen bg-sidebar border-r border-sidebar-border flex-col sticky top-0 overflow-hidden hidden lg:flex transition-all duration-200"
      >
        <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-3 overflow-hidden hover:opacity-80 transition-opacity cursor-pointer w-full"
          >
            <div className="h-6 w-6 rounded-md bg-sidebar-primary flex items-center justify-center flex-shrink-0">
              <span className="text-sidebar-primary-foreground font-semibold text-xs">T</span>
            </div>
            {!collapsed && (
              <span className="text-base font-semibold whitespace-nowrap">
                TaskFlow
              </span>
            )}
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-150",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70"
                )
              }
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={logout}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-md w-full",
              "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-foreground",
              "transition-colors duration-150"
            )}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!collapsed && (
              <span className="text-sm font-medium whitespace-nowrap">
                Logout
              </span>
            )}
          </button>
        </div>
      </aside>

      {isOpen && (
        <aside className="fixed left-0 top-0 h-screen w-[280px] bg-sidebar border-r border-sidebar-border flex flex-col z-50 lg:hidden">
          <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-md bg-sidebar-primary flex items-center justify-center flex-shrink-0">
                <span className="text-sidebar-primary-foreground font-semibold text-xs">T</span>
              </div>
              <span className="text-base font-semibold whitespace-nowrap">TaskFlow</span>
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-sidebar-accent transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-150",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground/70"
                  )
                }
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm font-medium whitespace-nowrap">
                  {item.label}
                </span>
              </NavLink>
            ))}
          </nav>

          <div className="p-3 border-t border-sidebar-border">
            <button
              onClick={logout}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md w-full",
                "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-foreground",
                "transition-colors duration-150"
              )}
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm font-medium whitespace-nowrap">Logout</span>
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
