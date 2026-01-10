import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  FileText, 
  MessageSquare, 
  BarChart3, 
  Settings,
  Boxes,
  FileInput,
  Shield,
  Layers,
  Users,
  Calculator
} from "lucide-react";
import { Button } from "./ui/button";
import type { UserRole } from "../types/database.types";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole?: UserRole;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, allowedRoles: ["Admin", "Dealer", "Sales", "Viewer"] as UserRole[] },
  { id: "products", label: "Product Catalog", icon: Package, allowedRoles: ["Admin", "Dealer", "Sales", "Viewer"] as UserRole[] },
  { id: "orders", label: "Orders", icon: ShoppingCart, allowedRoles: ["Admin", "Dealer", "Sales", "Viewer"] as UserRole[] },
  { id: "quotation", label: "Quotation", icon: FileInput, allowedRoles: ["Admin", "Dealer", "Sales", "Viewer"] as UserRole[] },
  { id: "windowQuotation", label: "Window Quotation", icon: Calculator, allowedRoles: ["Admin", "Dealer", "Sales", "Viewer"] as UserRole[] },
  { id: "materials", label: "Material Catalog", icon: Layers, allowedRoles: ["Admin", "Dealer", "Sales", "Viewer"] as UserRole[] },
  { id: "inventory", label: "Inventory", icon: Boxes, allowedRoles: ["Admin", "Dealer", "Sales", "Viewer"] as UserRole[] },
  { id: "documents", label: "Documents", icon: FileText, allowedRoles: ["Admin", "Dealer", "Sales", "Viewer"] as UserRole[] },
  { id: "messages", label: "Messages", icon: MessageSquare, allowedRoles: ["Admin", "Dealer", "Sales", "Viewer"] as UserRole[] },
  { id: "analytics", label: "Analytics", icon: BarChart3, allowedRoles: ["Admin", "Dealer", "Sales", "Viewer"] as UserRole[] },
  { id: "users", label: "User Management", icon: Users, allowedRoles: ["Admin", "Sales"] as UserRole[] },
  { id: "settings", label: "Settings", icon: Settings, allowedRoles: ["Admin", "Dealer", "Sales", "Viewer"] as UserRole[] },
  { id: "admin", label: "Admin Backend", icon: Shield, allowedRoles: ["Admin", "Sales"] as UserRole[] },
];

export function Sidebar({ activeTab, onTabChange, userRole = "Dealer" }: SidebarProps) {
  // Filter menu items based on user role
  const visibleMenuItems = menuItems.filter((item) =>
    item.allowedRoles.includes(userRole)
  );

  return (
    <aside className="w-64 bg-white border-r h-[calc(100vh-73px)] sticky top-[73px]">
      <nav className="p-4 space-y-1">
        {visibleMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <Button
              key={item.id}
              variant={isActive ? "secondary" : "ghost"}
              className={`w-full justify-start gap-3 ${
                isActive ? "bg-blue-50 text-blue-600 hover:bg-blue-100" : ""
              }`}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>
    </aside>
  );
}