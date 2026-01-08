import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { TrendingUp, Package, ShoppingCart, DollarSign, AlertCircle } from "lucide-react";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

export function Dashboard() {
  const stats = [
    {
      title: "Total Orders",
      value: "248",
      change: "+12.5%",
      trend: "up",
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Revenue (YTD)",
      value: "$842,350",
      change: "+18.2%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Products Ordered",
      value: "1,842",
      change: "+8.1%",
      trend: "up",
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Pending Orders",
      value: "12",
      change: "-3",
      trend: "down",
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const recentOrders = [
    { id: "ORD-2024-1245", product: "YKK AP 350 Series Window", status: "Shipped", amount: "$3,240", date: "Dec 28, 2024" },
    { id: "ORD-2024-1244", product: "YKK AP Storefront System", status: "Processing", amount: "$12,450", date: "Dec 27, 2024" },
    { id: "ORD-2024-1243", product: "YKK AP Door Hardware Kit", status: "Delivered", amount: "$890", date: "Dec 26, 2024" },
    { id: "ORD-2024-1242", product: "YKK AP Curtain Wall System", status: "Shipped", amount: "$28,900", date: "Dec 25, 2024" },
  ];

  const salesGoal = {
    current: 842350,
    target: 1000000,
    percentage: 84
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-2">Welcome back, John!</h2>
        <p className="text-gray-500">Here's what's happening with your dealership today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <Badge variant={stat.trend === "up" ? "default" : "secondary"}>
                    {stat.change}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Your latest order activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900">{order.id}</p>
                      <Badge variant={
                        order.status === "Delivered" ? "default" :
                        order.status === "Shipped" ? "secondary" :
                        "outline"
                      }>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">{order.product}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{order.amount}</p>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Annual Sales Goal</CardTitle>
              <CardDescription>Year-to-date progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-medium">{salesGoal.percentage}%</span>
                </div>
                <Progress value={salesGoal.percentage} />
              </div>
              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Current</span>
                  <span className="font-medium">${salesGoal.current.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Target</span>
                  <span className="font-medium">${salesGoal.target.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Remaining</span>
                  <span className="font-medium text-blue-600">
                    ${(salesGoal.target - salesGoal.current).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <button className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                <p className="font-medium text-sm">Place New Order</p>
                <p className="text-xs text-gray-500">Browse product catalog</p>
              </button>
              <button className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                <p className="font-medium text-sm">Track Shipment</p>
                <p className="text-xs text-gray-500">Check order status</p>
              </button>
              <button className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                <p className="font-medium text-sm">Contact Support</p>
                <p className="text-xs text-gray-500">Get help from YKK AP team</p>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
