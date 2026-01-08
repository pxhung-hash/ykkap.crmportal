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
  Plus, 
  Trash2, 
  Eye,
  Calendar,
  Building2,
  User,
  Mail,
  Phone,
  Download,
  Loader2,
  RefreshCw,
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock
} from "lucide-react";

interface OrderItem {
  id: string;
  windowCode: string;
  image: string;
  description: string;
  series: string;
  width: number;
  height: number;
  area: number;
  quantity: number;
  unitPrice: number;
  discountRate: number;
}

interface Order {
  id: string;
  quotationId: string;
  customerName: string;
  date: string;
  products: string;
  itemCount: number;
  total: string;
  status: string;
  tracking: string;
  estDelivery: string;
}

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-2024-1245",
      quotationId: "QT-2024-002",
      customerName: "Prime Windows & Doors",
      date: "2024-12-28",
      products: "YKK AP 350 Series Window",
      itemCount: 10,
      total: "$3,240.00",
      status: "shipped",
      tracking: "1Z9994s10312345784",
      estDelivery: "2025-01-02"
    },
    {
      id: "ORD-2024-1244",
      quotationId: "QT-2024-003",
      customerName: "BuildRight Solutions",
      date: "2024-12-27",
      products: "YKK AP Storefront System",
      itemCount: 2,
      total: "$12,450.00",
      status: "processing",
      tracking: "-",
      estDelivery: "2025-01-05"
    },
    {
      id: "ORD-2024-1243",
      quotationId: "QT-2024-004",
      customerName: "Metro Construction LLC",
      date: "2024-12-26",
      products: "YKK AP Door Hardware Kit",
      itemCount: 5,
      total: "$890.00",
      status: "delivered",
      tracking: "1Z9994s10312345783",
      estDelivery: "2024-12-28"
    },
    {
      id: "ORD-2024-1242",
      quotationId: "QT-2024-005",
      customerName: "Metro Construction LLC",
      date: "2024-12-25",
      products: "YKK AP Curtain Wall System",
      itemCount: 5,
      total: "$28,900.00",
      status: "shipped",
      tracking: "1Z9994s10312345782",
      estDelivery: "2025-01-03"
    },
    {
      id: "ORD-2024-1241",
      quotationId: "QT-2024-006",
      customerName: "Urban Development Co",
      date: "2024-12-23",
      products: "YKK AP Thermal Break Frame",
      itemCount: 20,
      total: "$8,900.00",
      status: "delivered",
      tracking: "1Z9994s10312345781",
      estDelivery: "2024-12-27"
    },
    {
      id: "ORD-2024-1240",
      quotationId: "QT-2024-007",
      customerName: "City Builders Inc",
      date: "2024-12-22",
      products: "YKK AP Sliding Door System",
      itemCount: 8,
      total: "$5,400.00",
      status: "delivered",
      tracking: "1Z9994s10312345780",
      estDelivery: "2024-12-26"
    },
  ]);

  const [showNewOrder, setShowNewOrder] = useState(false);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // New order form state
  const [selectedQuotationId, setSelectedQuotationId] = useState("");
  const [availableQuotations, setAvailableQuotations] = useState([
    { id: "QT-2024-002", customerName: "Prime Windows & Doors", total: "15,680,000 ₫", status: "approved" },
    { id: "QT-2024-003", customerName: "BuildRight Solutions", total: "8,200,000 ₫", status: "approved" },
    { id: "QT-2024-004", customerName: "Metro Construction LLC", total: "12,450,000 ₫", status: "approved" },
  ]);

  const [orderInfo, setOrderInfo] = useState({
    deliveryAddress: "",
    deliveryDate: "",
    paymentTerms: "",
    shippingMethod: "",
    specialInstructions: ""
  });

  const [items, setItems] = useState<OrderItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04d82a51/orders`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (!response.ok) {
        console.log('No orders found in database, using default list');
        return;
      }

      const data = await response.json();
      
      if (data.success && data.orders && data.orders.length > 0) {
        setOrders(data.orders);
        console.log('Orders loaded successfully:', data.orders);
      } else {
        console.log('No orders available in database');
      }
    } catch (error) {
      console.log('Could not connect to database, using default orders list');
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const loadQuotationData = async (quotationId: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04d82a51/quotations/${quotationId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (!response.ok) {
        console.log('Quotation not found in database');
        // Load from sample data
        const selectedQuotation = availableQuotations.find(q => q.id === quotationId);
        if (selectedQuotation) {
          setCustomerInfo({
            companyName: selectedQuotation.customerName,
            contactPerson: "",
            email: "",
            phone: "",
            address: ""
          });
        }
        return;
      }

      const data = await response.json();
      
      if (data.success && data.quotation) {
        console.log('Quotation data loaded:', data.quotation);
        setCustomerInfo(data.quotation.customerInfo || {
          companyName: "",
          contactPerson: "",
          email: "",
          phone: "",
          address: ""
        });
        setItems(data.quotation.items || []);
      }
    } catch (error) {
      console.log('Could not load quotation data from database');
    }
  };

  const handleQuotationSelect = (quotationId: string) => {
    setSelectedQuotationId(quotationId);
    loadQuotationData(quotationId);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const handleCreateOrder = async () => {
    if (!selectedQuotationId) {
      alert('Please select a quotation');
      return;
    }

    try {
      const orderId = `ORD-${Date.now()}`;
      const grandTotal = items.reduce((sum, item) => {
        const subtotal = item.area * item.quantity * item.unitPrice;
        const discount = subtotal * (item.discountRate / 100);
        return sum + (subtotal - discount);
      }, 0);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04d82a51/orders`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            id: orderId,
            quotationId: selectedQuotationId,
            customerInfo,
            items,
            orderInfo,
            total: formatCurrency(grandTotal),
            status: 'processing',
            createdAt: new Date().toISOString()
          })
        }
      );

      const data = await response.json();

      if (data.success) {
        alert('Order created successfully!');
        
        // Add to local orders list
        const newOrder: Order = {
          id: orderId,
          quotationId: selectedQuotationId,
          customerName: customerInfo.companyName,
          date: new Date().toISOString(),
          products: items.length > 0 ? items[0].description : "Order items",
          itemCount: items.length,
          total: formatCurrency(grandTotal),
          status: "processing",
          tracking: "-",
          estDelivery: orderInfo.deliveryDate || ""
        };
        
        setOrders([newOrder, ...orders]);
        setShowNewOrder(false);
        
        // Reset form
        setSelectedQuotationId("");
        setItems([]);
        setCustomerInfo({
          companyName: "",
          contactPerson: "",
          email: "",
          phone: "",
          address: ""
        });
        setOrderInfo({
          deliveryAddress: "",
          deliveryDate: "",
          paymentTerms: "",
          shippingMethod: "",
          specialInstructions: ""
        });
      } else {
        throw new Error(data.error || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      case "shipped":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      case "processing":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
      case "cancelled":
        return "bg-red-100 text-red-700 hover:bg-red-100";
      case "pending":
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle2 className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "processing":
        return <Clock className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.products.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showOrderDetail && selectedOrder) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-900 mb-2">Order Details</h2>
            <p className="text-gray-500">View order information and tracking</p>
          </div>
          <Button variant="outline" onClick={() => setShowOrderDetail(false)}>
            Back to Orders
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Order #{selectedOrder.id}</CardTitle>
                  <Badge variant="secondary" className={getStatusColor(selectedOrder.status)}>
                    <span className="flex items-center gap-2">
                      {getStatusIcon(selectedOrder.status)}
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="font-medium">{new Date(selectedOrder.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Quotation Reference</p>
                    <p className="font-medium">{selectedOrder.quotationId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="font-medium">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="font-medium">{selectedOrder.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tracking Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Tracking Number</p>
                    <p className="font-medium">{selectedOrder.tracking}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Estimated Delivery</p>
                    <p className="font-medium">
                      {selectedOrder.estDelivery ? new Date(selectedOrder.estDelivery).toLocaleDateString() : '-'}
                    </p>
                  </div>
                </div>

                {selectedOrder.tracking !== "-" && (
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-3">Shipping Progress</p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Order Confirmed</p>
                          <p className="text-xs text-gray-500">{new Date(selectedOrder.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Processing</p>
                          <p className="text-xs text-gray-500">Completed</p>
                        </div>
                      </div>
                      {selectedOrder.status === "shipped" || selectedOrder.status === "delivered" ? (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Truck className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">In Transit</p>
                            <p className="text-xs text-gray-500">On the way</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <Truck className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium text-sm text-gray-400">In Transit</p>
                            <p className="text-xs text-gray-400">Pending</p>
                          </div>
                        </div>
                      )}
                      {selectedOrder.status === "delivered" ? (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Delivered</p>
                            <p className="text-xs text-gray-500">{new Date(selectedOrder.estDelivery).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <CheckCircle2 className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium text-sm text-gray-400">Delivered</p>
                            <p className="text-xs text-gray-400">Pending</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Products:</span>
                    <span className="font-medium">{selectedOrder.products}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Items:</span>
                    <span className="font-medium">{selectedOrder.itemCount}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-3 border-t">
                    <span className="font-semibold">Total Amount:</span>
                    <span className="font-bold text-blue-600">{selectedOrder.total}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-sm">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-700">
                <p className="mb-2">Contact our support team:</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    <span>1-800-YKK-APAP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    <span>support@ykkap.com</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (showNewOrder) {
    return (
      <div className="space-y-6">
        <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Order?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel? Any unsaved changes will be lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>No</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                setShowCancelDialog(false);
                setShowNewOrder(false);
              }}>
                Yes
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-900 mb-2">Create New Order</h2>
            <p className="text-gray-500">Create a sales order from an approved quotation</p>
          </div>
          <Button variant="outline" onClick={() => setShowCancelDialog(true)}>
            Cancel
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Quotation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="quotation">Approved Quotation *</Label>
                  <Select value={selectedQuotationId} onValueChange={handleQuotationSelect}>
                    <SelectTrigger id="quotation">
                      <SelectValue placeholder="Select an approved quotation" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableQuotations.map((quotation) => (
                        <SelectItem key={quotation.id} value={quotation.id}>
                          {quotation.id} - {quotation.customerName} ({quotation.total})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedQuotationId && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-900 mb-2">Quotation Details</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-blue-700">Customer:</span>
                        <span className="ml-2 font-medium">{customerInfo.companyName}</span>
                      </div>
                      <div>
                        <span className="text-blue-700">Items:</span>
                        <span className="ml-2 font-medium">{items.length}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {selectedQuotationId && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input 
                          id="companyName" 
                          value={customerInfo.companyName}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, companyName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactPerson">Contact Person</Label>
                        <Input 
                          id="contactPerson" 
                          value={customerInfo.contactPerson}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, contactPerson: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email"
                          value={customerInfo.email}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          type="tel"
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Order Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="deliveryDate">Requested Delivery Date *</Label>
                        <Input 
                          id="deliveryDate" 
                          type="date"
                          value={orderInfo.deliveryDate}
                          onChange={(e) => setOrderInfo({ ...orderInfo, deliveryDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paymentTerms">Payment Terms</Label>
                        <Select
                          value={orderInfo.paymentTerms}
                          onValueChange={(value) => setOrderInfo({ ...orderInfo, paymentTerms: value })}
                        >
                          <SelectTrigger id="paymentTerms">
                            <SelectValue placeholder="Select payment terms" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="net30">Net 30</SelectItem>
                            <SelectItem value="net60">Net 60</SelectItem>
                            <SelectItem value="net90">Net 90</SelectItem>
                            <SelectItem value="cod">Cash on Delivery</SelectItem>
                            <SelectItem value="prepaid">Prepaid</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="shippingMethod">Shipping Method</Label>
                        <Select
                          value={orderInfo.shippingMethod}
                          onValueChange={(value) => setOrderInfo({ ...orderInfo, shippingMethod: value })}
                        >
                          <SelectTrigger id="shippingMethod">
                            <SelectValue placeholder="Select shipping method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Standard Shipping</SelectItem>
                            <SelectItem value="express">Express Shipping</SelectItem>
                            <SelectItem value="freight">Freight</SelectItem>
                            <SelectItem value="pickup">Customer Pickup</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deliveryAddress">Delivery Address *</Label>
                      <Textarea 
                        id="deliveryAddress" 
                        placeholder="Enter complete delivery address"
                        rows={3}
                        value={orderInfo.deliveryAddress}
                        onChange={(e) => setOrderInfo({ ...orderInfo, deliveryAddress: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialInstructions">Special Instructions</Label>
                      <Textarea 
                        id="specialInstructions" 
                        placeholder="Any special delivery or handling instructions"
                        rows={3}
                        value={orderInfo.specialInstructions}
                        onChange={(e) => setOrderInfo({ ...orderInfo, specialInstructions: e.target.value })}
                      />
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Quotation ID:</span>
                    <span className="font-medium">{selectedQuotationId || '-'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Order Date:</span>
                    <span className="font-medium">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Products:</span>
                    <span className="font-medium">{items.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Quantity:</span>
                    <span className="font-medium">
                      {items.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm pt-3 border-t">
                    <span className="font-semibold">Grand Total:</span>
                    <span className="font-bold text-blue-600">
                      {formatCurrency(items.reduce((sum, item) => {
                        const subtotal = item.area * item.quantity * item.unitPrice;
                        const discount = subtotal * (item.discountRate / 100);
                        return sum + (subtotal - discount);
                      }, 0))}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button 
                    className="w-full" 
                    onClick={handleCreateOrder}
                    disabled={!selectedQuotationId || !orderInfo.deliveryDate || !orderInfo.deliveryAddress}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Order
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    By creating this order, you confirm that all details are correct and agree to the terms and conditions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 mb-2">Order Management</h2>
          <p className="text-gray-500">Track and manage all your YKK AP orders</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadOrders} disabled={isLoadingOrders}>
            {isLoadingOrders ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
          <Button onClick={() => setShowNewOrder(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Place New Order
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search orders..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{orders.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Processing</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {orders.filter(o => o.status === "processing").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Shipped</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {orders.filter(o => o.status === "shipped").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Delivered</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {orders.filter(o => o.status === "delivered").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Order ID</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Products</th>
                  <th className="text-left py-3 px-4">Total</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Tracking</th>
                  <th className="text-left py-3 px-4">Est. Delivery</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium">{order.id}</td>
                    <td className="py-4 px-4 text-gray-600">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      {order.products} ({order.itemCount})
                    </td>
                    <td className="py-4 px-4 font-medium">{order.total}</td>
                    <td className="py-4 px-4">
                      <Badge variant="secondary" className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-gray-600 text-sm">{order.tracking}</td>
                    <td className="py-4 px-4 text-gray-600">
                      {order.estDelivery ? new Date(order.estDelivery).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
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
}
