import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";
import { Progress } from "./ui/progress";

export function Inventory() {
  const inventoryItems = [
    {
      id: 1,
      product: "YKK AP 350 Series Window",
      sku: "YKK-350-WIN",
      inStock: 45,
      allocated: 12,
      available: 33,
      reorderPoint: 20,
      status: "healthy",
      lastOrdered: "Dec 15, 2024"
    },
    {
      id: 2,
      product: "YKK AP Storefront System",
      sku: "YKK-STORE-SYS",
      inStock: 8,
      allocated: 2,
      available: 6,
      reorderPoint: 5,
      status: "low",
      lastOrdered: "Dec 10, 2024"
    },
    {
      id: 3,
      product: "YKK AP Door Hardware Kit",
      sku: "YKK-DOOR-HW",
      inStock: 120,
      allocated: 15,
      available: 105,
      reorderPoint: 30,
      status: "healthy",
      lastOrdered: "Dec 20, 2024"
    },
    {
      id: 4,
      product: "YKK AP Curtain Wall System",
      sku: "YKK-CW-SYS",
      inStock: 3,
      allocated: 5,
      available: -2,
      reorderPoint: 5,
      status: "critical",
      lastOrdered: "Dec 5, 2024"
    },
    {
      id: 5,
      product: "YKK AP Thermal Break Frame",
      sku: "YKK-TB-FRAME",
      inStock: 67,
      allocated: 20,
      available: 47,
      reorderPoint: 25,
      status: "healthy",
      lastOrdered: "Dec 18, 2024"
    },
    {
      id: 6,
      product: "YKK AP Sliding Door System",
      sku: "YKK-SLIDE-DR",
      inStock: 18,
      allocated: 8,
      available: 10,
      reorderPoint: 15,
      status: "low",
      lastOrdered: "Dec 12, 2024"
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return <Badge variant="default">Healthy</Badge>;
      case "low":
        return <Badge variant="secondary">Low Stock</Badge>;
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const totalValue = inventoryItems.reduce((sum, item) => sum + (item.inStock * 324), 0);
  const lowStockItems = inventoryItems.filter(item => item.status === "low" || item.status === "critical").length;
  const healthyItems = inventoryItems.filter(item => item.status === "healthy").length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-2">Inventory Management</h2>
        <p className="text-gray-500">Monitor and manage your YKK AP product inventory</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Inventory Value</p>
                <p className="text-2xl font-bold text-gray-900">${totalValue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Low Stock Items</p>
                <p className="text-2xl font-bold text-orange-600">{lowStockItems}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Healthy Stock Items</p>
                <p className="text-2xl font-bold text-green-600">{healthyItems}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search inventory..."
            className="pl-10"
          />
        </div>
        <Button>Request Restock</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inventoryItems.map((item) => {
              const stockPercentage = (item.available / (item.reorderPoint * 3)) * 100;
              return (
                <div key={item.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{item.product}</h4>
                        {getStatusBadge(item.status)}
                      </div>
                      <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                    </div>
                    <Button variant="outline" size="sm">Reorder</Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">In Stock</p>
                      <p className="font-medium">{item.inStock}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Allocated</p>
                      <p className="font-medium">{item.allocated}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Available</p>
                      <p className={`font-medium ${item.available < 0 ? 'text-red-600' : ''}`}>
                        {item.available}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Reorder Point</p>
                      <p className="font-medium">{item.reorderPoint}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Last Ordered</p>
                      <p className="font-medium text-sm">{item.lastOrdered}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Stock Level</span>
                      <span>{Math.max(0, Math.round(stockPercentage))}%</span>
                    </div>
                    <Progress value={Math.max(0, Math.min(100, stockPercentage))} />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
