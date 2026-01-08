import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function Analytics() {
  const salesData = [
    { month: "Jan", sales: 45000, orders: 28 },
    { month: "Feb", sales: 52000, orders: 32 },
    { month: "Mar", sales: 48000, orders: 30 },
    { month: "Apr", sales: 61000, orders: 38 },
    { month: "May", sales: 55000, orders: 34 },
    { month: "Jun", sales: 67000, orders: 42 },
    { month: "Jul", sales: 72000, orders: 45 },
    { month: "Aug", sales: 68000, orders: 43 },
    { month: "Sep", sales: 75000, orders: 47 },
    { month: "Oct", sales: 82000, orders: 51 },
    { month: "Nov", sales: 78000, orders: 49 },
    { month: "Dec", sales: 85000, orders: 53 },
  ];

  const productData = [
    { name: "Windows", value: 35, sales: 294500 },
    { name: "Doors", value: 25, sales: 210750 },
    { name: "Curtain Walls", value: 20, sales: 168600 },
    { name: "Storefronts", value: 15, sales: 126450 },
    { name: "Hardware", value: 5, sales: 42150 },
  ];

  const quarterlyData = [
    { quarter: "Q1 2024", revenue: 145000, growth: 12 },
    { quarter: "Q2 2024", revenue: 183000, growth: 15 },
    { quarter: "Q3 2024", revenue: 215000, growth: 18 },
    { quarter: "Q4 2024", revenue: 245000, growth: 22 },
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-2">Analytics & Insights</h2>
        <p className="text-gray-500">Track your business performance and trends</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Total Revenue (2024)</p>
            <p className="text-2xl font-bold text-gray-900">$842,350</p>
            <p className="text-sm text-green-600 mt-1">+18.2% YoY</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Avg. Order Value</p>
            <p className="text-2xl font-bold text-gray-900">$3,397</p>
            <p className="text-sm text-green-600 mt-1">+8.2% YoY</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">248</p>
            <p className="text-sm text-green-600 mt-1">+12.5% YoY</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Customer Satisfaction</p>
            <p className="text-2xl font-bold text-gray-900">4.8/5.0</p>
            <p className="text-sm text-green-600 mt-1">+0.3 from last year</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales Trend</CardTitle>
            <CardDescription>Sales performance over the past 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} name="Sales ($)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quarterly Growth</CardTitle>
            <CardDescription>Revenue and growth rate by quarter</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={quarterlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#3b82f6" name="Revenue ($)" />
                <Bar dataKey="growth" fill="#10b981" name="Growth (%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales by Product Category</CardTitle>
            <CardDescription>Distribution of sales across product lines</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name} (${entry.value}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {productData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Revenue Breakdown</CardTitle>
            <CardDescription>Revenue contribution by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productData.map((product, index) => (
                <div key={product.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index] }}
                      />
                      <span className="text-sm font-medium">{product.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${product.sales.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{product.value}% of total</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${product.value}%`,
                        backgroundColor: COLORS[index]
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Best Selling Product</h4>
              <p className="text-sm text-gray-600 mb-1">YKK AP 350 Series Window</p>
              <p className="text-xs text-gray-500">1,245 units sold this year</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Peak Sales Month</h4>
              <p className="text-sm text-gray-600 mb-1">December 2024</p>
              <p className="text-xs text-gray-500">$85,000 in total sales</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Average Lead Time</h4>
              <p className="text-sm text-gray-600 mb-1">5.2 days</p>
              <p className="text-xs text-gray-500">12% faster than industry avg</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
