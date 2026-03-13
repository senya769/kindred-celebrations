import { NavLink, useLocation } from "react-router-dom";
import { Home, Users, Building2, CalendarDays, Newspaper, PenTool } from "lucide-react";

const navItems = [
  { to: "/", label: "Главная", icon: Home },
  { to: "/people", label: "Люди", icon: Users },
  { to: "/organizations", label: "Организации", icon: Building2 },
  { to: "/holidays", label: "Праздники", icon: CalendarDays },
  { to: "/news", label: "Новости", icon: Newspaper },
];

export default function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="w-60 min-h-screen bg-sidebar flex flex-col shrink-0">
      <div className="p-5 border-b border-sidebar-border">
        <h1 className="text-lg font-bold text-sidebar-primary-foreground tracking-tight">
          САП Поздравления
        </h1>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`sidebar-item ${isActive ? "sidebar-item-active" : "sidebar-item-inactive"}`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
