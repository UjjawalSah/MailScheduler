import { useState } from "react";
import { ChevronLeft, Layout, Mail, PieChart, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    icon: Layout,
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: Mail,
    label: "Schedule Mail",
    path: "#",
    submenu: [
      { label: "Business", path: "/templates/business" },
      { label: "Job Applications", path: "/templates/job-applications" },
      { label: "Marketing", path: "/templates/marketing" },
    ],
  },
  {
    icon: PieChart,
    label: "Analytics",
    path: "/analytics",
  },
  {
    icon: Settings,
    label: "History",
    path: "/settings",
  },
];

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  // Retrieve user details from sessionStorage
  const userName = sessionStorage.getItem("userName") || "John Doe";
  const userEmail = sessionStorage.getItem("userEmail") || "user@example.com"; // Optionally, you can also show email

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-screen bg-card border-r border-border transition-all duration-300 z-50",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        <Link to="/profile" className="p-6 border-b border-border hover:bg-accent/50 transition-colors">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <User className="h-6 w-6 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div>
                <h3 className="font-semibold">{userName}</h3> {/* Display userName from sessionStorage */}
                <p className="text-sm text-muted-foreground">User</p> {/* Changed from Admin to User */}
              </div>
            )}
          </div>
        </Link>

        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              const isExpanded = expandedMenu === item.label;

              return (
                <li key={item.label}>
                  {hasSubmenu ? (
                    <div>
                      <button
                        onClick={() => setExpandedMenu(isExpanded ? null : item.label)}
                        className={cn(
                          "flex items-center w-full gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                          "hover:bg-accent hover:text-accent-foreground",
                          isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {!isCollapsed && <span>{item.label}</span>}
                      </button>
                      {isExpanded && !isCollapsed && (
                        <ul className="pl-11 mt-2 space-y-2">
                          {item.submenu.map((subItem) => (
                            <li key={subItem.path}>
                              <Link
                                to={subItem.path}
                                className={cn(
                                  "block py-2 px-4 rounded-lg transition-all duration-200",
                                  "hover:bg-accent hover:text-accent-foreground",
                                  location.pathname === subItem.path
                                    ? "bg-accent text-accent-foreground"
                                    : "text-muted-foreground"
                                )}
                              >
                                {subItem.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                        "hover:bg-accent hover:text-accent-foreground",
                        isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {!isCollapsed && <span>{item.label}</span>}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center"
          >
            <ChevronLeft
              className={cn("h-5 w-5 transition-transform", isCollapsed && "rotate-180")}
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
