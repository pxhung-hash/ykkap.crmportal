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

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole?: "admin" | "dealer" | "sales" | "viewer";
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, allowedRoles: ["admin", "dealer", "sales", "viewer"] },
  { id: "products", label: "Product Catalog", icon: Package, allowedRoles: ["admin", "dealer", "sales", "viewer"] },
  { id: "orders", label: "Orders", icon: ShoppingCart, allowedRoles: ["admin", "dealer", "sales", "viewer"] },
  { id: "quotation", label: "Quotation", icon: FileInput, allowedRoles: ["admin", "dealer", "sales", "viewer"] },
  { id: "windowQuotation", label: "Window Quotation", icon: Calculator, allowedRoles: ["admin", "dealer", "sales", "viewer"] },
  { id: "materials", label: "Material Catalog", icon: Layers, allowedRoles: ["admin", "dealer", "sales", "viewer"] },
  { id: "inventory", label: "Inventory", icon: Boxes, allowedRoles: ["admin", "dealer", "sales", "viewer"] },
  { id: "documents", label: "Documents", icon: FileText, allowedRoles: ["admin", "dealer", "sales", "viewer"] },
  { id: "messages", label: "Messages", icon: MessageSquare, allowedRoles: ["admin", "dealer", "sales", "viewer"] },
  { id: "analytics", label: "Analytics", icon: BarChart3, allowedRoles: ["admin", "dealer", "sales", "viewer"] },
  { id: "users", label: "User Management", icon: Users, allowedRoles: ["admin", "sales"] },
  { id: "settings", label: "Settings", icon: Settings, allowedRoles: ["admin", "dealer", "sales", "viewer"] },
  { id: "admin", label: "Admin Backend", icon: Shield, allowedRoles: ["admin", "sales"] },
];

export function Sidebar({ activeTab, onTabChange, userRole = "dealer" }: SidebarProps) {
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