import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";
import {
  Users,
  FileText,
  ShoppingCart,
  Package,
  Settings,
  BarChart3,
  Trash2,
  Edit,
  Eye,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Mail,
  Database,
  UserCog,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Loader2,
  TrendingUp,
  DollarSign,
  Activity,
  Shapes,
  ArrowLeft,
  Calculator,
  Wrench,
  Layers
} from "lucide-react";
import { MaterialCatalog } from "./MaterialCatalog";
import { ProductDetail } from "./ProductDetail";
import { ProductCatalog } from "./ProductCatalog";
import { BOMStructure } from "./BOMStructure";
import { ModuleBOM } from "./ModuleBOM";
import { ProductConfigurationMaster } from "./ProductConfigurationMaster";
import { ProductManagementDashboard } from "./ProductManagementDashboard";
import { DealerPriceListManagement } from "./DealerPriceListManagement";

type AdminTab = "dashboard" | "users" | "quotations" | "orders" | "products" | "materials" | "settings" | "analytics" | "bomStructure" | "moduleBOM" | "productConfig" | "productManagement" | "priceList";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  company: string;
  status: string;
  createdAt: string;
  lastLogin: string;
}

interface Quotation {
  id: string;
  customerName: string;
  email: string;
  date: string;
  items: number;
  total: string;
  status: string;
  salesStatus: string;
}

interface Order {
  id: string;
  quotationId: string;
  customerName: string;
  orderDate: string;
  deliveryDate: string;
  status: string;
  total: string;
}

interface Product {
  id: string;
  code: string;
  name: string;
  series: string;
  category: string;
  unitPrice: number;
  stock: number;
  status: string;
}

export function AdminBackend() {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [configuringBOM, setConfiguringBOM] = useState<Product | null>(null);
  
  // BOM Configuration States
  const [bomItems, setBOMItems] = useState<any[]>([]);
  const [newBOMItem, setNewBOMItem] = useState({
    itemCode: "",
    description: "",
    itemType: "profile",
    formula: "",
    qtyPerWindow: 1,
    weightPerMeter: 0,
    unit: "mm"
  });

  // Sample data - replace with real API calls
  const [users, setUsers] = useState<User[]>([
    {
      id: "U001",
      email: "dealer1@example.com",
      name: "John Smith",
      role: "dealer",
      company: "ABC Construction",
      status: "active",
      createdAt: "2024-01-15",
      lastLogin: "2024-12-29"
    },
    {
      id: "U002",
      email: "dealer2@example.com",
      name: "Sarah Johnson",
      role: "dealer",
      company: "XYZ Builders",
      status: "active",
      createdAt: "2024-02-20",
      lastLogin: "2024-12-28"
    },
    {
      id: "U003",
      email: "dealer3@example.com",
      name: "Mike Chen",
      role: "dealer",
      company: "Prime Windows LLC",
      status: "inactive",
      createdAt: "2024-03-10",
      lastLogin: "2024-12-20"
    }
  ]);

  const [quotations, setQuotations] = useState<Quotation[]>([
    {
      id: "QT-2024-001",
      customerName: "ABC Construction",
      email: "dealer1@example.com",
      date: "2024-12-29",
      items: 5,
      total: "15,500,000 ₫",
      status: "draft",
      salesStatus: "estimating"
    },
    {
      id: "QT-2024-002",
      customerName: "XYZ Builders",
      email: "dealer2@example.com",
      date: "2024-12-28",
      items: 8,
      total: "22,300,000 ₫",
      status: "submitted",
      salesStatus: "submitted"
    }
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-2024-001",
      quotationId: "QT-2024-002",
      customerName: "XYZ Builders",
      orderDate: "2024-12-20",
      deliveryDate: "2025-01-15",
      status: "in_progress",
      total: "22,300,000 ₫"
    }
  ]);

  const [products, setProducts] = useState<Product[]>([
    {
      id: "P001",
      code: "YKK-350",
      name: "Sliding Window",
      series: "350 Series",
      category: "Windows",
      unitPrice: 500000,
      stock: 150,
      status: "available"
    },
    {
      id: "P002",
      code: "YKK-450",
      name: "Casement Window",
      series: "450 Series",
      category: "Windows",
      unitPrice: 600000,
      stock: 80,
      status: "available"
    },
    {
      id: "P003",
      code: "YKK-550",
      name: "Awning Window",
      series: "550 Series",
      category: "Windows",
      unitPrice: 700000,
      stock: 5,
      status: "low_stock"
    }
  ]);

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === "active").length,
    totalQuotations: quotations.length,
    pendingQuotations: quotations.filter(q => q.salesStatus === "estimating").length,
    totalOrders: orders.length,
    completedOrders: orders.filter(o => o.status === "completed").length,
    totalRevenue: "158,500,000 ₫",
    monthlyGrowth: "+12.5%"
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "available":
      case "approved":
      case "completed":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      case "pending":
      case "in_progress":
      case "estimating":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
      case "inactive":
      case "low_stock":
      case "rejected":
        return "bg-red-100 text-red-700 hover:bg-red-100";
      case "submitted":
      case "negotiation":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
    setShowDeleteDialog(false);
    alert("User deleted successfully!");
  };

  const handleDeleteQuotation = (quotationId: string) => {
    setQuotations(quotations.filter(q => q.id !== quotationId));
    setShowDeleteDialog(false);
    alert("Quotation deleted successfully!");
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders(orders.filter(o => o.id !== orderId));
    setShowDeleteDialog(false);
    alert("Order deleted successfully!");
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
    setShowDeleteDialog(false);
    alert("Product deleted successfully!");
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-2">Admin Dashboard</h2>
        <p className="text-gray-500">System overview and key metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalUsers}</p>
                <p className="text-xs text-green-600 mt-1">{stats.activeUsers} active</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Quotations</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalQuotations}</p>
                <p className="text-xs text-yellow-600 mt-1">{stats.pendingQuotations} pending</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Orders</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalOrders}</p>
                <p className="text-xs text-green-600 mt-1">{stats.completedOrders} completed</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalRevenue}</p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {stats.monthlyGrowth}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Quotations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quotations.slice(0, 5).map(quotation => (
                <div key={quotation.id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">{quotation.id}</p>
                    <p className="text-sm text-gray-500">{quotation.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{quotation.total}</p>
                    <Badge variant="secondary" className={getStatusColor(quotation.salesStatus)}>
                      {quotation.salesStatus}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.slice(0, 5).map(order => (
                <div key={order.id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-500">{order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{order.total}</p>
                    <Badge variant="secondary" className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Database className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Database</p>
                <p className="font-medium text-green-600">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Mail className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email Server</p>
                <p className="font-medium text-green-600">Configured</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">API Status</p>
                <p className="font-medium text-green-600">Healthy</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 mb-2">User Management</h2>
          <p className="text-gray-500">Manage dealer accounts and permissions</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users by name or email..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">User ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Company</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Last Login</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium">{user.id}</td>
                    <td className="py-4 px-4">{user.name}</td>
                    <td className="py-4 px-4 text-gray-600">{user.email}</td>
                    <td className="py-4 px-4">{user.company}</td>
                    <td className="py-4 px-4">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="secondary" className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{user.lastLogin}</td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedItem(user);
                            setShowDeleteDialog(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderQuotations = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 mb-2">Quotation Management</h2>
          <p className="text-gray-500">View and manage all quotation requests</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search quotations by ID or customer..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="estimating">Estimating</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="negotiation">Negotiation</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Quotations Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Quotation ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Items</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Total</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {quotations.map(quotation => (
                  <tr key={quotation.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium">{quotation.id}</td>
                    <td className="py-4 px-4">{quotation.customerName}</td>
                    <td className="py-4 px-4 text-gray-600">{quotation.email}</td>
                    <td className="py-4 px-4 text-gray-600">{quotation.date}</td>
                    <td className="py-4 px-4">{quotation.items} items</td>
                    <td className="py-4 px-4 font-medium">{quotation.total}</td>
                    <td className="py-4 px-4">
                      <Badge variant="secondary" className={getStatusColor(quotation.salesStatus)}>
                        {quotation.salesStatus}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedItem(quotation);
                            setShowDeleteDialog(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 mb-2">Order Management</h2>
          <p className="text-gray-500">Track and manage all orders</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Order
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Order ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Quotation ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Order Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Delivery Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Total</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium">{order.id}</td>
                    <td className="py-4 px-4 text-gray-600">{order.quotationId}</td>
                    <td className="py-4 px-4">{order.customerName}</td>
                    <td className="py-4 px-4 text-gray-600">{order.orderDate}</td>
                    <td className="py-4 px-4 text-gray-600">{order.deliveryDate}</td>
                    <td className="py-4 px-4 font-medium">{order.total}</td>
                    <td className="py-4 px-4">
                      <Badge variant="secondary" className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedItem(order);
                            setShowDeleteDialog(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderProducts = () => {
    // If configuring BOM, show BOM Configuration interface
    if (configuringBOM) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Button variant="outline" onClick={() => setConfiguringBOM(null)} className="mb-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Button>
              <h2 className="text-gray-900 mb-2">BOM Configuration</h2>
              <p className="text-gray-500">Configure Bill of Materials for {configuringBOM.name}</p>
            </div>
            <Button onClick={() => {
              alert("BOM configuration saved!");
              setConfiguringBOM(null);
            }}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Save BOM Configuration
            </Button>
          </div>

          {/* Product Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Product Code</p>
                  <p className="font-medium text-gray-900">{configuringBOM.code}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Product Name</p>
                  <p className="font-medium text-gray-900">{configuringBOM.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Series</p>
                  <p className="font-medium text-gray-900">{configuringBOM.series}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium text-gray-900">{configuringBOM.category}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formula Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Formula Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="font-medium text-blue-900 mb-2">Available Variables:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <code className="bg-white px-2 py-1 rounded text-blue-600">W</code>
                    <span className="text-gray-600 ml-2">Width (mm)</span>
                  </div>
                  <div>
                    <code className="bg-white px-2 py-1 rounded text-blue-600">H</code>
                    <span className="text-gray-600 ml-2">Height (mm)</span>
                  </div>
                  <div>
                    <code className="bg-white px-2 py-1 rounded text-blue-600">P</code>
                    <span className="text-gray-600 ml-2">Perimeter</span>
                  </div>
                  <div>
                    <code className="bg-white px-2 py-1 rounded text-blue-600">A</code>
                    <span className="text-gray-600 ml-2">Area</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  <strong>Example formulas:</strong> <code className="bg-white px-2 py-1 rounded">W - 40</code>, 
                  <code className="bg-white px-2 py-1 rounded ml-2">H - 40</code>, 
                  <code className="bg-white px-2 py-1 rounded ml-2">(W + H) * 2</code>,
                  <code className="bg-white px-2 py-1 rounded ml-2">W / 2 - 50</code>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Add New BOM Item */}
          <Card>
            <CardHeader>
              <CardTitle>Add BOM Item</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault();
                setBOMItems([...bomItems, { ...newBOMItem, id: Date.now() }]);
                setNewBOMItem({
                  itemCode: "",
                  description: "",
                  itemType: "profile",
                  formula: "",
                  qtyPerWindow: 1,
                  weightPerMeter: 0,
                  unit: "mm"
                });
              }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="item-code">Item Code *</Label>
                    <Input
                      id="item-code"
                      value={newBOMItem.itemCode}
                      onChange={(e) => setNewBOMItem({...newBOMItem, itemCode: e.target.value})}
                      placeholder="e.g., PRF-350-HF"
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="item-description">Description *</Label>
                    <Input
                      id="item-description"
                      value={newBOMItem.description}
                      onChange={(e) => setNewBOMItem({...newBOMItem, description: e.target.value})}
                      placeholder="e.g., 350 Series Head Frame"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="item-type">Item Type *</Label>
                    <Select 
                      value={newBOMItem.itemType}
                      onValueChange={(value) => setNewBOMItem({...newBOMItem, itemType: value})}
                    >
                      <SelectTrigger id="item-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="profile">Profile</SelectItem>
                        <SelectItem value="hardware">Hardware</SelectItem>
                        <SelectItem value="accessory">Accessory</SelectItem>
                        <SelectItem value="gasket">Gasket</SelectItem>
                        <SelectItem value="glass">Glass</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="formula">Formula *</Label>
                    <Input
                      id="formula"
                      value={newBOMItem.formula}
                      onChange={(e) => setNewBOMItem({...newBOMItem, formula: e.target.value})}
                      placeholder="e.g., W - 40"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="qty-per-window">Qty/Window *</Label>
                    <Input
                      id="qty-per-window"
                      type="number"
                      min="1"
                      value={newBOMItem.qtyPerWindow}
                      onChange={(e) => setNewBOMItem({...newBOMItem, qtyPerWindow: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                  {newBOMItem.itemType === "profile" && (
                    <div className="space-y-2">
                      <Label htmlFor="weight-per-meter">Weight/m (kg)</Label>
                      <Input
                        id="weight-per-meter"
                        type="number"
                        step="0.01"
                        value={newBOMItem.weightPerMeter}
                        onChange={(e) => setNewBOMItem({...newBOMItem, weightPerMeter: parseFloat(e.target.value)})}
                      />
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item to BOM
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* BOM Items List */}
          <Card>
            <CardHeader>
              <CardTitle>Current BOM Structure ({bomItems.length} items)</CardTitle>
            </CardHeader>
            <CardContent>
              {bomItems.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p>No BOM items configured yet.</p>
                  <p className="text-sm">Add items using the form above.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Group by Item Type */}
                  {["profile", "hardware", "accessory", "gasket", "glass"].map(type => {
                    const items = bomItems.filter(item => item.itemType === type);
                    if (items.length === 0) return null;
                    
                    return (
                      <div key={type}>
                        <h3 className="font-medium text-gray-900 mb-2 capitalize bg-gray-50 px-3 py-2 rounded">
                          {type}s ({items.length})
                        </h3>
                        <div className="space-y-2">
                          {items.map((item) => (
                            <div key={item.id} className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                              <div className="flex items-start justify-between">
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-3">
                                  <div>
                                    <p className="text-xs text-gray-500">Item Code</p>
                                    <p className="font-medium text-gray-900">{item.itemCode}</p>
                                  </div>
                                  <div className="md:col-span-2">
                                    <p className="text-xs text-gray-500">Description</p>
                                    <p className="font-medium text-gray-900">{item.description}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Formula</p>
                                    <code className="text-sm bg-blue-50 px-2 py-1 rounded text-blue-600">{item.formula}</code>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Qty/Window</p>
                                    <p className="font-medium text-gray-900">{item.qtyPerWindow}</p>
                                  </div>
                                  {item.itemType === "profile" && item.weightPerMeter > 0 && (
                                    <div>
                                      <p className="text-xs text-gray-500">Weight/m</p>
                                      <p className="font-medium text-gray-900">{item.weightPerMeter} kg</p>
                                    </div>
                                  )}
                                </div>
                                <div className="flex gap-2 ml-4">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => {
                                      const updatedItems = bomItems.filter(i => i.id !== item.id);
                                      setBOMItems(updatedItems);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Formula Test Calculator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Test BOM Calculation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Width (mm)</Label>
                    <Input type="number" placeholder="1200" id="test-width" />
                  </div>
                  <div className="space-y-2">
                    <Label>Height (mm)</Label>
                    <Input type="number" placeholder="1500" id="test-height" />
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input type="number" placeholder="10" id="test-qty" />
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    const W = parseFloat((document.getElementById('test-width') as HTMLInputElement)?.value || "0");
                    const H = parseFloat((document.getElementById('test-height') as HTMLInputElement)?.value || "0");
                    const qty = parseInt((document.getElementById('test-qty') as HTMLInputElement)?.value || "1");
                    
                    if (W > 0 && H > 0) {
                      let results = "BOM Calculation Results:\n\n";
                      bomItems.forEach(item => {
                        try {
                          const formula = item.formula.replace(/W/g, W.toString()).replace(/H/g, H.toString());
                          const result = eval(formula);
                          results += `${item.itemCode}: ${result.toFixed(2)}mm x ${item.qtyPerWindow} = ${(result * item.qtyPerWindow).toFixed(2)}mm per window\n`;
                          results += `Total for ${qty} windows: ${(result * item.qtyPerWindow * qty).toFixed(2)}mm\n\n`;
                        } catch (e) {
                          results += `${item.itemCode}: Error in formula\n\n`;
                        }
                      });
                      alert(results);
                    } else {
                      alert("Please enter valid width and height values.");
                    }
                  }}
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate BOM
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // If viewing a product, show ProductDetail component
    if (viewingProduct) {
      return (
        <ProductDetail 
          productId={parseInt(viewingProduct.id.replace('P', ''))} 
          onBack={() => setViewingProduct(null)}
        />
      );
    }

    // If editing a product, show edit form
    if (editingProduct) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-gray-900 mb-2">Edit Product</h2>
              <p className="text-gray-500">Update product information</p>
            </div>
            <Button variant="outline" onClick={() => setEditingProduct(null)}>
              Cancel
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                const updatedProducts = products.map(p => 
                  p.id === editingProduct.id ? editingProduct : p
                );
                setProducts(updatedProducts);
                setEditingProduct(null);
                alert("Product updated successfully!");
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-code">Product Code</Label>
                    <Input 
                      id="edit-code"
                      value={editingProduct.code}
                      onChange={(e) => setEditingProduct({...editingProduct, code: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Product Name</Label>
                    <Input 
                      id="edit-name"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-series">Series</Label>
                    <Input 
                      id="edit-series"
                      value={editingProduct.series}
                      onChange={(e) => setEditingProduct({...editingProduct, series: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-category">Category</Label>
                    <Select 
                      value={editingProduct.category}
                      onValueChange={(value) => setEditingProduct({...editingProduct, category: value})}
                    >
                      <SelectTrigger id="edit-category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Windows">Windows</SelectItem>
                        <SelectItem value="Doors">Doors</SelectItem>
                        <SelectItem value="Curtain Walls">Curtain Walls</SelectItem>
                        <SelectItem value="Storefronts">Storefronts</SelectItem>
                        <SelectItem value="Hardware">Hardware</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-price">Unit Price (₫)</Label>
                    <Input 
                      id="edit-price"
                      type="number"
                      value={editingProduct.unitPrice}
                      onChange={(e) => setEditingProduct({...editingProduct, unitPrice: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-stock">Stock</Label>
                    <Input 
                      id="edit-stock"
                      type="number"
                      value={editingProduct.stock}
                      onChange={(e) => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select 
                      value={editingProduct.status}
                      onValueChange={(value) => setEditingProduct({...editingProduct, status: value})}
                    >
                      <SelectTrigger id="edit-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="low_stock">Low Stock</SelectItem>
                        <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                        <SelectItem value="discontinued">Discontinued</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setEditingProduct(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Default: Show product list
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-900 mb-2">Product Management</h2>
            <p className="text-gray-500">Manage product catalog and inventory</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Product Code</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Series</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Unit Price</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Stock</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium">{product.code}</td>
                    <td className="py-4 px-4">{product.name}</td>
                    <td className="py-4 px-4 text-gray-600">{product.series}</td>
                    <td className="py-4 px-4">{product.category}</td>
                    <td className="py-4 px-4 font-medium">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.unitPrice)}
                    </td>
                    <td className="py-4 px-4">{product.stock}</td>
                    <td className="py-4 px-4">
                      <Badge variant="secondary" className={getStatusColor(product.status)}>
                        {product.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setViewingProduct(product)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingProduct(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setConfiguringBOM(product);
                            setBOMItems([]); // Reset BOM items for this product
                          }}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
                        >
                          <Wrench className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedItem(product);
                            setShowDeleteDialog(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
    );
  };

  const renderMaterials = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-2">Material Catalog</h2>
        <p className="text-gray-500">Manage and view material catalog</p>
      </div>

      {/* Material Catalog */}
      <MaterialCatalog isAdmin={true} />
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-2">System Settings</h2>
        <p className="text-gray-500">Configure system preferences and integrations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Server Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Server Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="smtp-host">SMTP Host</Label>
              <Input id="smtp-host" placeholder="smtp.gmail.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-port">SMTP Port</Label>
              <Input id="smtp-port" placeholder="587" type="number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-user">SMTP Username</Label>
              <Input id="smtp-user" placeholder="your-email@gmail.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-pass">SMTP Password</Label>
              <Input id="smtp-pass" type="password" placeholder="••••••••" />
            </div>
            <Button className="w-full">
              <CheckCircle className="h-4 w-4 mr-2" />
              Save Configuration
            </Button>
          </CardContent>
        </Card>

        {/* Database Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Backup Database</p>
                  <p className="text-sm text-gray-500">Last backup: 2024-12-29 10:30 AM</p>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Backup
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Clear Cache</p>
                  <p className="text-sm text-gray-500">Improve system performance</p>
                </div>
                <Button size="sm" variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-red-900">Reset Database</p>
                  <p className="text-sm text-red-600">⚠️ This action cannot be undone</p>
                </div>
                <Button size="sm" variant="outline" className="text-red-600 border-red-300 hover:bg-red-100">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              System Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <Select defaultValue="vnd">
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vnd">Vietnamese Dong (₫)</SelectItem>
                  <SelectItem value="usd">US Dollar ($)</SelectItem>
                  <SelectItem value="eur">Euro (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select defaultValue="asia">
                <SelectTrigger id="timezone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asia">Asia/Ho_Chi_Minh</SelectItem>
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="est">EST</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Default Language</Label>
              <Select defaultValue="en">
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="vi">Vietnamese</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full">
              <CheckCircle className="h-4 w-4 mr-2" />
              Save Preferences
            </Button>
          </CardContent>
        </Card>

        {/* User Permissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5" />
              User Permissions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Dealer Registration</p>
                  <p className="text-sm text-gray-500">Allow new dealer sign-ups</p>
                </div>
                <input type="checkbox" className="w-4 h-4" defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Auto-approve Quotations</p>
                  <p className="text-sm text-gray-500">Automatically approve under limit</p>
                </div>
                <input type="checkbox" className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-500">Send system notifications</p>
                </div>
                <input type="checkbox" className="w-4 h-4" defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-2">Analytics & Reports</h2>
        <p className="text-gray-500">View system analytics and generate reports</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Revenue (YTD)</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">158,500,000 ₫</p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +18.5% from last year
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">68.5%</p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +5.2% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg. Order Value</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">22,300,000 ₫</p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12.8% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate Reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="report-type">Report Type</Label>
              <Select>
                <SelectTrigger id="report-type">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales Report</SelectItem>
                  <SelectItem value="quotations">Quotations Report</SelectItem>
                  <SelectItem value="users">User Activity Report</SelectItem>
                  <SelectItem value="inventory">Inventory Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input id="start-date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input id="end-date" type="date" />
              </div>
            </div>
            <Button className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.slice(0, 3).map((product, index) => (
                <div key={product.id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.series}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{product.stock} units</p>
                    <p className="text-sm text-green-600">+15% sales</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowDeleteDialog(false);
              setSelectedItem(null);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedItem) {
                  if (activeTab === "users") handleDeleteUser(selectedItem.id);
                  else if (activeTab === "quotations") handleDeleteQuotation(selectedItem.id);
                  else if (activeTab === "orders") handleDeleteOrder(selectedItem.id);
                  else if (activeTab === "products") handleDeleteProduct(selectedItem.id);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Admin Backend</h1>
          <p className="text-gray-500">YKK AP CRM Portal Administration</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            System Online
          </Badge>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b">
        <div className="flex gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "dashboard"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "users"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <Users className="h-4 w-4" />
            Users
          </button>
          <button
            onClick={() => setActiveTab("quotations")}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "quotations"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <FileText className="h-4 w-4" />
            Quotations
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "orders"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            Orders
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "products"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <Package className="h-4 w-4" />
            Products
          </button>
          <button
            onClick={() => setActiveTab("materials")}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "materials"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <Shapes className="h-4 w-4" />
            Materials
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "analytics"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </button>
          <button
            onClick={() => setActiveTab("bomStructure")}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "bomStructure"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <Wrench className="h-4 w-4" />
            BOM Structure
          </button>
          <button
            onClick={() => setActiveTab("moduleBOM")}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "moduleBOM"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <Layers className="h-4 w-4" />
            Module BOM
          </button>
          <button
            onClick={() => setActiveTab("productConfig")}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "productConfig"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <Settings className="h-4 w-4" />
            Product Config
          </button>
          <button
            onClick={() => setActiveTab("productManagement")}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "productManagement"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <Package className="h-4 w-4" />
            Product Mgmt
          </button>
          <button
            onClick={() => setActiveTab("priceList")}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "priceList"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <DollarSign className="h-4 w-4" />
            Price List
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "settings"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "users" && renderUsers()}
        {activeTab === "quotations" && renderQuotations()}
        {activeTab === "orders" && renderOrders()}
        {activeTab === "products" && renderProducts()}
        {activeTab === "materials" && renderMaterials()}
        {activeTab === "bomStructure" && <BOMStructure />}
        {activeTab === "moduleBOM" && <ModuleBOM />}
        {activeTab === "productConfig" && <ProductConfigurationMaster />}
        {activeTab === "productManagement" && <ProductManagementDashboard />}
        {activeTab === "priceList" && <DealerPriceListManagement />}
        {activeTab === "settings" && renderSettings()}
        {activeTab === "analytics" && renderAnalytics()}
      </div>
    </div>
  );
}